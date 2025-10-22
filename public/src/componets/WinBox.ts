import { TextBox } from "./TextBox";

export class WinBox extends TextBox {
  constructor(message: string = "") {
    super(message, "win-box");
  }
}
