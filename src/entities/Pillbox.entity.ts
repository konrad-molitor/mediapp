import {PBCell, PBCellState} from './PBCell.entity';

export class Pillbox {
  private static instance: Pillbox;
  rows: number;
  cols: number;
  cells: PBCell[];
  createdAt: Date;
  updatedAt: Date;

  constructor(rows: number, cols: number, cells?: PBCell[], createdAt?: Date, updatedAt?: Date) {
    this.rows = rows;
    this.cols = cols;
    this.cells = cells || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    if (this.cells.length === 0) {
      this.initCells();
    }
  }

  public static getInstance(rows: number, cols: number): Pillbox {
    if (!Pillbox.instance) {
      Pillbox.instance = new Pillbox(rows, cols);
    }
    return Pillbox.instance;
  }

  private initCells() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push(new PBCell(row, col));
      }
    }
  }

  public updatePillbox(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    this.initCells();
    this.updatedAt = new Date();
  }

  public getCell(row: number, col: number): PBCell | null {
    return this.cells.find(
      (cell) => cell.position.row === row && cell.position.col === col
    ) || null;
  }

  public assignMedicationToCell(medicationId: string, cellId: string) {
    const cell = this.cells.find((cell) => cell.id === cellId);
    if (cell) {
      cell.medicationId = medicationId;
      cell.state = PBCellState.Filled;
      this.updatedAt = new Date();
    }
  }

  public unassignMedicationFromCell(cellId: string) {
    const cell = this.cells.find((cell) => cell.id === cellId);
    if (cell) {
      cell.medicationId = null;
      cell.state = PBCellState.NotUsed;
      this.updatedAt = new Date();
    }
  }

  public static fromJSON(json: any): Pillbox {
    const cells = json.cells.map((cellJson: Object) => PBCell.fromJSON(cellJson));
    return new Pillbox(
      json.rows,
      json.cols,
      cells,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }

  public toJSON(): any {
    return {
      rows: this.rows,
      cols: this.cols,
      cells: this.cells.map((cell) => cell.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public clone(updatedProperties?: Partial<Pillbox>): Pillbox {
    return new Pillbox(
      updatedProperties?.rows || this.rows,
      updatedProperties?.cols || this.cols,
      updatedProperties?.cells || this.cells.map((cell) => cell.clone()),
      updatedProperties?.createdAt || this.createdAt,
      updatedProperties?.updatedAt || this.updatedAt
    );
  }
}
