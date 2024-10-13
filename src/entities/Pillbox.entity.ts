import { PBCell } from './PBCell.entity';

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
    this.initCells(); // Initialize the pillbox with cells
  }

  public static getInstance(rows: number, cols: number): Pillbox {
    if (!Pillbox.instance) {
      Pillbox.instance = new Pillbox(rows, cols);
    }
    return Pillbox.instance;
  }

  // Initialize the cells based on rows and columns
  private initCells() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.cells.push(new PBCell(row, col));
      }
    }
  }

  // Update the pillbox layout (e.g., if rows or cols change)
  public updatePillbox(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    this.initCells();
    this.updatedAt = new Date();
  }

  // Get a cell by its row and column
  public getCell(row: number, col: number): PBCell | null {
    return this.cells.find(cell => cell.position.row === row && cell.position.col === col) || null;
  }
}
