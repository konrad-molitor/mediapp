import {PBCell, PBCellState} from './PBCell.entity';

export class Pillbox {
  private static instance: Pillbox;
  rows: number;
  cols: number;
  cells: PBCell[];
  createdAt: Date;
  updatedAt: Date;

  private constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.initCells();
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
}
