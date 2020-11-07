import { IQuickCommands , ICustViewDef } from "./IReUsableInterfaces";

export const wideViewDef : ICustViewDef = {
  minWidth: 1000,
  viewFields: [
    { name: "Id", displayName: "Id", minWidth: 50 },
    { name: "Title", displayName: "Title", minWidth: 200 }
  ],
  includeAttach: false,
  includeDetails: true,
  includeListLink: false,
  groupByFields: []
};

export const medViewDef : ICustViewDef = {
  minWidth: 700,
  viewFields: [
    { name: "Id", displayName: "Id", minWidth: 50 },
    { name: "Title", displayName: "Title", minWidth: 200 }
  ],
  includeAttach: false,
  includeDetails: true,
  includeListLink: false,
  groupByFields: []
};

export const narrowViewDef : ICustViewDef = {
  minWidth: 400,
  viewFields: [
    { name: "Id", displayName: "Id", minWidth: 50 },
    { name: "Title", displayName: "Title", minWidth: 200 }
  ],
  includeAttach: false,
  includeDetails: true,
  includeListLink: false,
  groupByFields: []
};


export const ActionNewsViewDefs : ICustViewDef[] = [
  wideViewDef, medViewDef, narrowViewDef
];

