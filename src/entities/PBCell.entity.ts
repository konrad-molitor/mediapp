import { v4 as uuidv4 } from 'uuid';

export class PBCell {
  id: string;
  position: { row: number; col: number; rowLabel: string; colLabel: string };
  label: string;
  medicationId: string | null;
  state: PBCellState;

  constructor(
    row: number,
    col: number,
    id?: string,
    medicationId?: string | null,
    state?: PBCellState
  ) {
    this.id = id || uuidv4();
    this.position = {
      row,
      col,
      rowLabel: String.fromCharCode(65 + row),
      colLabel: (col + 1).toString(),
    };
    this.label = `${this.position.rowLabel}${this.position.colLabel}`;
    this.medicationId = medicationId || null;
    this.state = state || PBCellState.NotUsed;
  }


public static fromJSON(json: any): PBCell {
    const cell = new PBCell(json.position.row, json.position.col);
    cell.id = json.id;
    cell.medicationId = json.medicationId;
    cell.state = json.state;
    return cell;
  }

  public toJSON(): any {
    return {
      id: this.id,
      position: this.position,
      label: this.label,
      medicationId: this.medicationId,
      state: this.state,
    };
  }

  public clone(updatedProperties?: Partial<PBCell>): PBCell {
    return new PBCell(
      this.position.row,
      this.position.col,
      updatedProperties?.id || this.id,
      updatedProperties?.medicationId !== undefined ? updatedProperties.medicationId : this.medicationId,
      updatedProperties?.state || this.state
    );
  }
}

export enum PBCellState {
  Filled = "Filled",
  ToBeTakenNow = "ToBeTakenNow",
  Taken = "Taken",
  NotUsed = "NotUsed",
  Skipped = "Skipped",
  Overdue = "Overdue",
}
