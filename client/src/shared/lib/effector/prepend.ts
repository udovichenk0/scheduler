import { StoreWritable, createEvent } from "effector"

type Func<S,P> = ((s: S, p: P) => S)

export function prepend<S, P>($store: StoreWritable<S>, func: Func<S,P> | S){
  const event = createEvent<P>()
  if(typeof func == 'function'){
    $store.on(event, func as Func<S,P>)
  } else {
    $store.on(event, () => func)
  }
  return event
}