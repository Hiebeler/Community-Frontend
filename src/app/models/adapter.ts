export interface Adapter<TInput, TOutput> {
  adapt(item: TInput): TOutput;
}
