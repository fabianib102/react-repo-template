interface IAdditionalData {
  askedToJoin: boolean;
}

class Participant {
  status: string | undefined;
  action: string;
  additionalData: IAdditionalData;

  constructor(action: string) {
    this.status = undefined;
    this.action = action;
    this.additionalData = {
      askedToJoin: false,
    };
  }

  get data() {
    return {
      status: this.status,
      action: this.action,
      additionalData: this.additionalData,
    };
  }

  setStatus(value: string) {
    this.status = value;
  }

  setAction(value: string) {
    this.action = value;
  }

  askToJoin() {
    this.additionalData.askedToJoin = true;
  }

  dismissRequestToJoin() {
    this.additionalData.askedToJoin = false;
  }
}

export type { IAdditionalData };

export default Participant;
