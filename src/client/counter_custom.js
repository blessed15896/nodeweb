import { Even } from "./even_custom";
import { Odd } from "./odd_custom";

export const Counter = (context) => `
  <button class="btn btn-primary m-2" action="incrementCounter">
    Increment
  </button>
  <div>${context.counter % 2 !== 0 ? Odd(context) : Even(context)}</div>
`;
