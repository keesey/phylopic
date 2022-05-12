import { normalizeArcs } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { Reducer } from "react"
import { Action } from "./Actions"
import { Arc, NodesMap, State } from "./State"

const precedes = (arcs: readonly Arc[], x: UUID, y: UUID): boolean => {
    if (x === y) {
        return true
    }
    for (const arc of arcs) {
        if (arc[1] === y && precedes(arcs, x, arc[0])) {
            return true
        }
    }
    return false
}
const deleteNodeFromArcs = (arcs: readonly Readonly<[UUID, UUID]>[], deletee: UUID) =>
    normalizeArcs(arcs.filter(arc => arc[0] !== deletee && arc[1] !== deletee))
const replaceNodeInArcs = (arcs: readonly Readonly<[UUID, UUID]>[], replacee: UUID, replacer?: UUID) =>
    replacer
        ? normalizeArcs(
              arcs.reduce<readonly Arc[]>((prev, arc) => {
                  if (arc[0] === replacee) {
                      if (arc[1] === replacer) {
                          return prev
                      }
                      return [...prev, [replacer, arc[1]]]
                  }
                  if (arc[1] === replacee) {
                      if (arc[0] === replacer) {
                          return prev
                      }
                      return [...prev, [arc[0], replacer]]
                  }
                  return [...prev, arc]
              }, []),
          )
        : deleteNodeFromArcs(arcs, replacee)
const findParent = (arcs: readonly Arc[], uuid: UUID, root?: UUID): UUID | undefined => {
    const arc = arcs.find(([_, tail]) => tail === uuid)
    return arc?.[0] ?? root
}
const replaceNodeInMap = (nodesMap: NodesMap, replacee: UUID, replacer: UUID | undefined): NodesMap =>
    Object.entries(nodesMap)
        .filter(([uuid]) => uuid !== replacee)
        .reduce<NodesMap>(
            (prev, [uuid, node]) => ({
                ...prev,
                [uuid]:
                    node?.parent === replacee
                        ? {
                              ...node,
                              parent: replacer ?? null,
                          }
                        : node,
            }),
            {},
        )
const reducer: Reducer<State, Action> = (prevState, action) => {
    console.info(action)
    switch (action.type) {
        case "COMPLETE_LOAD":
        case "COMPLETE_SAVE": {
            return {
                ...prevState,
                error: undefined,
                pending: false,
            }
        }
        case "DELETE_NODE": {
            if (!prevState.modified.nodesMap[action.payload.uuid]) {
                return prevState
            }
            const parentUUID = findParent(prevState.modified.arcs, action.payload.uuid, prevState.root)
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    arcs: replaceNodeInArcs(prevState.modified.arcs, action.payload.uuid, parentUUID),
                    nodesMap: replaceNodeInMap(prevState.modified.nodesMap, action.payload.uuid, parentUUID),
                },
            }
        }
        case "FAIL_LOAD":
        case "FAIL_SAVE": {
            return {
                ...prevState,
                error: String(action.payload),
                pending: false,
            }
        }
        case "INITIALIZE": {
            return action.payload
        }
        case "MERGE_NODES": {
            const source = prevState.modified.nodesMap[action.payload.source]
            const destination = prevState.modified.nodesMap[action.payload.destination]
            if (!source || !destination || source === destination) {
                return prevState
            }
            const isParent = source?.parent === action.payload.destination
            const isChild = destination?.parent === action.payload.source
            const isSibling = destination?.parent === source?.parent
            if (!isParent && !isChild && !isSibling) {
                return prevState
            }
            return {
                ...prevState,
                error: undefined,
                modified: {
                    ...prevState.modified,
                    arcs: replaceNodeInArcs(prevState.modified.arcs, action.payload.source, action.payload.destination),
                    nodesMap: replaceNodeInMap(
                        prevState.modified.nodesMap,
                        action.payload.source,
                        action.payload.destination,
                    ),
                },
            }
        }
        case "RESET": {
            return {
                ...prevState,
                error: undefined,
                modified: prevState.original,
            }
        }
        case "SET_NODE_PARENT": {
            const childNode = prevState.modified.nodesMap[action.payload.child]
            const parentNode = prevState.modified.nodesMap[action.payload.parent]
            if (childNode?.parent === parentNode) {
                return prevState
            }
            if (
                !childNode ||
                !parentNode ||
                childNode.parent === action.payload.parent ||
                precedes(prevState.modified.arcs, action.payload.child, action.payload.parent)
            ) {
                return prevState
            }
            return {
                ...prevState,
                modified: {
                    ...prevState.modified,
                    arcs: normalizeArcs([
                        ...prevState.modified.arcs.filter(([_, tail]) => tail !== action.payload.child),
                        [action.payload.parent, action.payload.child],
                    ]),
                    nodesMap: {
                        ...prevState.modified.nodesMap,
                        [action.payload.child]: {
                            ...childNode,
                            parent: action.payload.parent,
                        },
                    },
                },
            }
        }
        case "START_LOAD":
        case "START_SAVE": {
            return {
                ...prevState,
                error: undefined,
                pending: true,
            }
        }
        default: {
            return prevState
        }
    }
}
export default reducer
