export interface DataList<T> {
  rowCount: number
  pageCount: number
  page: number
  rows: T[]
}
