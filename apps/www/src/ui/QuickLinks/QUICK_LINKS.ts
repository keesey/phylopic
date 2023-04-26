import { QuickLinkNode } from "./QuickLinkNode"

const QUICK_LINKS: QuickLinkNode = {
    label: "life",
    slug: "pan-biota",
    uuid: "8f901db5-84c1-4dc0-93ba-2300eeddf4ab",
    children: [
        {
            label: "bacteria",
            slug: "eubacteria",
            uuid: "f65ab2e9-57cc-4a29-9084-915401151541",
        },
        {
            slug: "eukarya",
            uuid: "11910548-fdd0-4566-b0f6-ccf1ad8e8a8d",
            children: [
                {
                    label: "plants",
                    slug: "archaeplastida",
                    uuid: "a10adc11-40d4-4b9e-8967-d995fdcd641a",
                    children: [
                        {
                            label: "grasses",
                            slug: "gramineae",
                            uuid: "47c188d0-d705-4b3f-b4ad-d51df47aab2f",
                        },
                        {
                            label: "oaks",
                            slug: "quercus",
                            uuid: "a88ce368-1742-4a8f-a9f5-ee440fa93d70",
                        },
                    ],
                },
                {
                    slug: "opisthokonta",
                    uuid: "6ed7f321-091f-43c0-8db3-fa36bde54558",
                    children: [
                        {
                            label: "fungi",
                            slug: "fungi",
                            uuid: "a27a6bff-275a-4a95-98e5-4776f0da96f1",
                        },
                        {
                            label: "animals",
                            slug: "metazoa",
                            uuid: "68424967-5109-4f0d-a8e2-77e7edbe94ab",
                            children: [
                                {
                                    label: "sponges",
                                    slug: "porifera",
                                    uuid: "d7324a9c-c170-4abc-b092-a5f5168f9365",
                                },
                                {
                                    slug: "nephrozoa",
                                    uuid: "68226175-f88d-4ea8-8228-3204c49bfda0",
                                    children: [
                                        {
                                            slug: "protostomia",
                                            uuid: "5768c9b0-d283-4244-9282-0a5f214f9c52",
                                            children: [
                                                {
                                                    slug: "trochozoa",
                                                    uuid: "64ce784a-52da-441e-b100-5f343172f138",
                                                    children: [
                                                        {
                                                            label: "annelids",
                                                            slug: "annelida",
                                                            uuid: "e3c01f12-f165-4308-9524-1c79fab0be1f",
                                                        },
                                                        {
                                                            label: "mollusks",
                                                            slug: "mollusca",
                                                            uuid: "8755d5c3-05f9-41e7-b103-e3420f9ecfc7",
                                                            children: [
                                                                {
                                                                    label: "snails",
                                                                    slug: "gastropoda",
                                                                    uuid: "076dfd9c-048b-4b54-84f6-f4545fb96bc6",
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    slug: "arthropoda",
                                                    uuid: "7447f794-107a-471d-8042-aceb16ccc564",
                                                    children: [
                                                        {
                                                            label: "spiders",
                                                            slug: "araneae",
                                                            uuid: "51a811a3-bb61-455b-be59-a3328e877bc8",
                                                        },
                                                        {
                                                            label: "insects",
                                                            slug: "insecta",
                                                            uuid: "6aa19cb6-f14c-470d-b223-6e42604862c1",
                                                            children: [
                                                                {
                                                                    label: "damselflies & dragonflies",
                                                                    slug: "odonata",
                                                                    uuid: "5ffbd7d5-9e6c-407a-b0de-5e58b49c7dc7",
                                                                },
                                                                {
                                                                    slug: "endopterygota",
                                                                    uuid: "da0feb47-f2dc-4ab8-b439-b974c0e4aa03",
                                                                    children: [
                                                                        {
                                                                            label: "bees",
                                                                            slug: "apiformes",
                                                                            uuid: "a779ce10-9ba1-4ec8-867a-52abf90f4733",
                                                                        },
                                                                        {
                                                                            slug: "aparaglossata",
                                                                            uuid: "d916db5c-b15c-4ec4-ae9b-f8f56f06461c",
                                                                            children: [
                                                                                {
                                                                                    label: "beetles",
                                                                                    slug: "coleoptera",
                                                                                    uuid: "7d611043-d8e6-4141-a2d1-1a2209f846b2",
                                                                                },
                                                                                {
                                                                                    slug: "panorpida",
                                                                                    uuid: "31edc5d4-7b5a-47b9-b35b-c5ad047ed030",
                                                                                    children: [
                                                                                        {
                                                                                            label: "flies",
                                                                                            slug: "diptera",
                                                                                            uuid: "7ab0a659-1e87-43c5-9ae0-202dc3088590",
                                                                                        },
                                                                                        {
                                                                                            label: "moths",
                                                                                            slug: "lepidoptera",
                                                                                            uuid: "cd2f1099-70c5-494b-8c13-2ebe60b51cf1",
                                                                                        },
                                                                                    ],
                                                                                },
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: "vertebrates",
                                            slug: "vertebrata",
                                            uuid: "d55ad9b6-fc6b-43c5-8ebf-8635a34dcfb3",
                                            children: [
                                                {
                                                    label: "amphibians",
                                                    slug: "amphibia",
                                                    uuid: "ab10018a-325b-4db8-b11c-2bfd346132c7",
                                                },
                                                {
                                                    slug: "amniota",
                                                    uuid: "7d115d90-9e94-4c77-9509-6916c67f6342",
                                                    children: [
                                                        {
                                                            slug: "reptilia",
                                                            uuid: "e26cb1cf-dd25-440f-ac62-0bd14675583f",
                                                            children: [
                                                                {
                                                                    label: "lizards",
                                                                    slug: "squamata",
                                                                    uuid: "600a2585-ba45-446e-a37c-897d90467491",
                                                                },
                                                                {
                                                                    slug: "archelosauria",
                                                                    uuid: "bfad1155-8c9e-419d-bfc4-1c0148914744",
                                                                    children: [
                                                                        {
                                                                            label: "turtles",
                                                                            slug: "testudines",
                                                                            uuid: "58aa4745-ddfe-4b5f-b009-7cd4f72e9798",
                                                                        },
                                                                        {
                                                                            label: "dinosaurs",
                                                                            slug: "dinosauria",
                                                                            uuid: "b0d75722-6ce9-458c-abf5-04118975c6be",
                                                                            children: [
                                                                                {
                                                                                    label: "birds",
                                                                                    slug: "aves",
                                                                                    uuid: "667b8664-5dd7-487e-ba56-c6c5c95055a2",
                                                                                    children: [
                                                                                        {
                                                                                            label: "owls",
                                                                                            slug: "strigiformes",
                                                                                            uuid: "8665e368-650f-4e98-9bc2-8c83ee584d73",
                                                                                        },
                                                                                    ],
                                                                                },
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            label: "mammals",
                                                            slug: "mammalia",
                                                            uuid: "1fccccf8-fbee-416c-9cd9-eb9c9cc88ae8",
                                                            children: [
                                                                {
                                                                    slug: "scrotifera",
                                                                    uuid: "287004c6-ffc5-4b17-9033-5b1654df7e51",
                                                                    children: [
                                                                        {
                                                                            label: "bats",
                                                                            slug: "chiroptera",
                                                                            uuid: "d54c7ac7-7ac6-40c1-8c4f-5faf3a2f8b56",
                                                                        },
                                                                        {
                                                                            label: "whales",
                                                                            slug: "cetacea",
                                                                            uuid: "0a3df856-c941-49d3-8811-a93bb9d0813c",
                                                                        },
                                                                    ],
                                                                },
                                                                {
                                                                    slug: "euarchontoglires",
                                                                    uuid: "8909c602-2135-4889-bcd7-ceb239924cfb",
                                                                    children: [
                                                                        {
                                                                            label: "humans",
                                                                            slug: "homo-sapiens",
                                                                            uuid: "1ee65cf3-53db-4a52-9960-a9f7093d845d",
                                                                        },
                                                                        {
                                                                            label: "rodents",
                                                                            slug: "rodentia",
                                                                            uuid: "5e3f2d10-435d-49c3-80de-d14dba1eafd3",
                                                                            children: [
                                                                                {
                                                                                    label: "mice & rats",
                                                                                    slug: "muridae",
                                                                                    uuid: "3492cd03-e097-473a-a056-3199ed32ec64",
                                                                                },
                                                                            ],
                                                                        },
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}
export default QUICK_LINKS
