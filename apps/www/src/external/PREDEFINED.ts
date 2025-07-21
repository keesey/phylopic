import { type UUID } from "@phylopic/utils"
import { type AgeResult } from "./AgeResult"
import { SMITHSONIAN_HUMAN_ORIGINS, TIMETREE, WIKIPEDIA } from "./SOURCES"
export type AgeSourceRecord = Record<UUID, AgeResult | null | undefined>
// :KLUDGE: The Paleobiology Database's hominin dates are too general.
const HOMININI: AgeSourceRecord = {
    // Hominini
    "108914b5-0937-44d8-a789-8aeb9ea90492": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [7000000, 0],
    },
    // Sahelanthropus tchadensis
    "d3ff803d-d755-45a7-8ce9-0d4c03cbd2fa": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [7000000, 6000000],
    },
    // Orrorin tugenensis
    "41c7b05b-8282-4ec4-a383-a3295dd891af": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [6200000, 5800000],
    },
    // Ardipithecus
    "14a7fc48-d548-47c9-bf94-471f79a4e024": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [5800000, 4400000],
    },
    // Ardipithecus kadabba
    "e7905312-d915-4222-9b16-a8727999c3cb": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [5800000, 5200000],
    },
    // Ardipithecus ramidus
    "c3c5b80d-9678-48eb-b3e0-3afc0350c978": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [4400000, 4400000],
    },
    // Hominina
    "ad1f65d6-51fd-423a-ad71-2f941b738730": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [4200000, 0],
    },
    // Praeanthropus anamensis
    "2de7a5fe-dd1c-4e3b-8334-8499f9e6fd24": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [4200000, 3800000],
    },
    // Praeanthropus afarensis
    "cf8c018b-24db-4441-91e3-d88f67458ba4": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [3850000, 2850000],
    },
    // Hominiti
    "f72651d1-d317-478c-9fd2-6c5e6e5ebb48": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [3500000, 0],
    },
    // Kenyanthropus platyops
    "f8de785c-05ba-4b52-8852-3ee54451b720": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [3500000, 3500000],
    },
    // Australopithecus africanus
    "1779c96a-9e4a-4de8-8325-6a85453b249e": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [3300000, 2100000],
    },
    // Paranthropus
    "76fa3329-d534-4bfb-a493-cfd1afe534b2": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [2700000, 1200000],
    },
    // Paranthropus aethiopicus
    "53193229-4115-40c0-9ce1-8c11b819215b": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [2700000, 2300000],
    },
    // Praeanthropus garhi
    "a5a71d55-ae24-4890-98cf-936eaa55041f": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [2500000, 2500000],
    },
    // Homo habilis
    "dc576506-3d55-4290-8a3f-43d0f9d6b4ff": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [2400000, 1400000],
    },
    // Paranthropus boisei
    "d38c14fe-ed97-461b-b75c-6c0486a7072e": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [2300000, 1200000],
    },
    // Homo
    "0267e0fc-4a4c-4a5c-ac82-fab27715a910": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [2040000, 0],
    },
    // Homo (Homo)
    "be6a3968-b8d1-4a48-bc80-26c906c8d95e": {
        ...WIKIPEDIA,
        ages: [2040000, 0],
    },
    // Homo ergaster
    "05ed1032-9615-4895-87c8-b58babe1ea17": {
        ...WIKIPEDIA,
        ages: [2040000, 870000],
    },
    // Homo sediba
    "9e8b577a-59d5-4900-9796-ad267d224647": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [1980000, 1977000],
    },
    // Homo rudolfensis
    "ed68149b-50c3-4f48-b18d-260bd1c788c6": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [1900000, 1800000],
    },
    // Homo georgicus
    "d05f0ec1-8145-4d6f-b22e-c4f97fa69c36": {
        ...WIKIPEDIA,
        ages: [1850000, 1770000],
    },
    // Homo erectus
    "ccce423a-a71e-4ed6-8205-6c13dc2c54e3": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [1890000, 110000],
    },
    // Paranthropus robustus
    "b8d62563-24f7-46c5-839a-863d398ba97a": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [1800000, 1200000],
    },
    // Homo (sapiens)
    "7b1368a2-e505-4a6c-a236-17c2dc529975": {
        ...WIKIPEDIA,
        ages: [1200000, 0],
    },
    // Homo antecessor
    "345ee81b-7a8e-4e01-a477-935796b51ee7": {
        ...WIKIPEDIA,
        ages: [1200000, 770000],
    },
    // Homo neanderthalensis
    "4015cb2e-7f94-4a31-888f-73525264eda2": null,
    // Homo neanderthalensis neanderthalensis
    "15444b9c-f17f-4d6e-89b5-5990096bcfb0": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [400000, 40000],
    },
    // Homo naledi
    "b3ab7412-6229-40bc-b398-9d6356bf91f8": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [335000, 236000],
    },
    // Homo rhodesiensis rhodesiensis
    "65705fb7-b133-4b4e-96f1-7d98d1e4d3f6": {
        ...WIKIPEDIA,
        ages: [324000, 274000],
    },
    // Homo sapiens
    "1ee65cf3-53db-4a52-9960-a9f7093d845d": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [300000, 0],
    },
    // Homo floresiensis
    "a8c3722d-30a9-4a4a-80e0-b74a6c73cfe5": {
        ...SMITHSONIAN_HUMAN_ORIGINS,
        ages: [100000, 50000],
    },
}
// :KLUDGE: The root node doesn't have a reliable estimate.
const ROOT: AgeSourceRecord = {
    // Pan-Biota
    "8f901db5-84c1-4dc0-93ba-2300eeddf4ab": null,
}
// :KLUDGE: TimeTree has some nodes that have invalid data in the API or are difficult to look up.
const TIMETREE_ERRATA: AgeSourceRecord = {
    // Biota
    "d2a5e07b-bf10-4733-96f2-cae5a807fc83": {
        ...TIMETREE,
        ages: [4250000000, 4250000000],
    },
    // Felidae
    "8ca9a277-8b17-4208-a8b5-c8d55ad516a1": {
        ...TIMETREE,
        ages: [11900000, 11900000],
    },
    // Mammalia
    "1fccccf8-fbee-416c-9cd9-eb9c9cc88ae8": {
        ...TIMETREE,
        ages: [163700000, 185900000],
    },
}
const PREDEFINED: AgeSourceRecord = {
    ...HOMININI,
    ...ROOT,
    ...TIMETREE_ERRATA,
}
export default PREDEFINED
