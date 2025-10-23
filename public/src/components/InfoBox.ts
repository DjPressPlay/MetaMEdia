
import { TextBox } from "./TextBox";

export class InfoBox extends TextBox {
  constructor(message: string = "") {
    super(message, "info-box");
  }
}
