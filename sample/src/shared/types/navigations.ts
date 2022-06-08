interface RouteWithParamsInterface {
  route: string;
  params: unknown;
}

export type AsParamListBase<T extends RouteWithParamsInterface> = {
  [k in T['route']]: T extends { route: k; params: infer P } ? P : never;
};
