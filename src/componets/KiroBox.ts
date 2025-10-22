import { TextBox } from "./TextBox";

export class KiroBox extends TextBox {
  constructor(message: string = "") {
    super(message, "kiro-box");
  }
}
