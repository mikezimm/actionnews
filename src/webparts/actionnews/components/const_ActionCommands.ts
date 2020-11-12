import { IQuickCommands , ICustViewDef } from "./IReUsableInterfaces";

export const ActionQuickCommands: IQuickCommands = {
    onUpdateReload: true,
    callBack: null,
    successBanner: 3.5,

    quickFields: [],
    buttons: [
      [
        {
          "label": "ParkMe",
          "primary": true,
          "alert": "Hey, you Parked the project!",
          "confirm": "Are you sure you want to Park this Project?",
          "console": "Confirming we just parked a project",
          "panelMessage": "ParkedPanel Text goes here!",
          "icon": "Car",
          "updateItem": {
            "Status": "8. Park"
          },
          "showWhenEvalTrue": "item.Status !== '8. Park'"
        },
        {
          "label": "CompleteMe",
          "primary": false,
          "alert": "Hey, you Completed the project!",
          "confirm": "Are you sure you want to Complete this Project?",
          "console": "Confirming we just Completed a project",
          "panelMessage": "Complete Panel Text goes here!",
          "icon": "Checkbox",
          "updateItem": {
            "Status": "9. Completed"
          },
          "showWhenEvalTrue": "item.Status.indexOf('9') !== 0"
        }
      ],
      
      [
        {
          "label": "Backup MS {+me}",
          "primary": false,
          "alert": "Hey, It's all yours now!",
          "confirm": "Are you sure you want to take this {me}?",
          "console": "Confirming we just this is assigned to you",
          "panelMessage": "Complete Panel Text goes here!",
          "icon": "User",
          "updateItem": {
            "Backup0Id": "{+Me}"
          }
        },
        {
          "label": "Remove me",
          "primary": false,
          "alert": "Hey, your out!",
          "confirm": "Are you sure you want to take you off this one?",
          "console": "Confirming we just removed you you",
          "panelMessage": "Complete Panel Text goes here!",
          "icon": "User",
          "updateItem": {
            "Backup0Id": "{-Me}"
          }
        }
      ],

      [
        {
          "label": "MultiField",
          "primary": false,
          "alert": "DueDate is set!",
          "confirm": "Are you sure you mark this DueDate today?",
          "console": "Confirming we just this is has been DueDate",
          "panelMessage": "Complete Panel Text goes here!",
          "icon": "User",
          "updateItem": {
            "DueDate": "[today+14]",
            "StartDate": "[today-7]",
            "Backup0Id": "{+Me}",
            "AssignedToId": "[Me]",
            "Status": "Hello World",
            "ReviewDays": 99,
            "Body": "Hellow world! It's [Today+3] and I'm [MyName]"
          }
        },
      ]
    ],

  };