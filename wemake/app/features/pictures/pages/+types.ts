export namespace Route {
  export interface LoaderArgs {
    params: {
      productId: string;
    };
  }

  export interface ActionArgs {
    request: Request;
    params: {
      productId: string;
    };
  }

  export interface MetaFunction {
    params: {
      productId: string;
    };
  }

  export interface ComponentProps<TLoaderData, TActionData> {
    loaderData: TLoaderData;
    actionData: TActionData;
  }
}
