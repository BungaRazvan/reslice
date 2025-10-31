export type Slice<R> = R extends {
  $$mapped: true;
  $$state: infer St;
  $$child: infer C;
  $$selectors: infer S;
  $$actions: infer A;
}
  ? St & Slice<C> & S & A
  : R extends {
      $$bind: true;
      $$state: infer St;
      $$actions: infer A;
    }
  ? St & A
  : R extends Record<string, any>
  ? { [K in keyof R]: Slice<R[K]> }
  : R;

export type Thunk<R> = (dispatch: Function, getSlice: () => Slice<R>) => void;

type Actions = Record<string, (...args: any[]) => any>;
type Selectors = Record<string, any>;
type Selector<Input = any, Props = any, Output = any> = (
  state: Input,
  props?: Props
) => Output;

// Internal shapes (for inference only)
interface BoundReducerInternal<S = {}, A extends Actions = {}> {
  $$bind: true;
  $$reducer: (state: S, action: any) => S;
  $$state: S;
  $$selectors: Record<string, any>;
  $$actions: A;
}

interface MappedReducerInternal<
  S,
  Child extends Record<string, any> = {},
  Sels extends Selectors = {},
  Acts extends Actions = {}
> {
  $$mapped: true;
  $$reducer: (state: S, action: any) => S;
  $$state: S;
  $$child: Child;
  $$selectors: Sels;
  $$actions: Acts;
}

// Public facades (hide $$)
type BoundReducerPublic<S, A> = S & A;
type MappedReducerPublic<S, Sels, Acts> = S & Sels & Acts;

// Bind reducer
export declare function bindReducer<
  S,
  A extends Record<string, (...args: any[]) => any> = {}
>(
  reducer: (state: S, action: any) => S,
  config?: { selectors?: Record<string, any>; actions?: A }
): BoundReducerPublic<S, A>;

export declare function mappedReducer<
  S,
  Child extends Record<string, any>,
  Sels extends Record<string, any> = {},
  Acts extends Record<string, (...args: any[]) => any> = {}
>(
  reducer: (state: S, action: any) => S,
  child: Child,
  config?: { selectors?: Sels; actions?: Acts }
): MappedReducerPublic<S, Sels, Acts>;

// Internal shape for combineReducers (never exposed)
interface CombineReducerInternal<
  R extends Record<string, any>,
  Sels extends Selectors = {},
  Acts extends Actions = {}
> {
  $$combine: true;
  $$reducers: R;
  $$selectors: Sels;
  $$actions: Acts;
}

// Public facade: merges state + actions + selectors
type CombineReducerPublic<
  R extends Record<string, any>,
  Sels,
  Acts
> = Slice<R> & Sels & Acts;

export declare function combineReducers<
  R extends Record<string, any>,
  Sels extends Selectors = {},
  Acts extends Actions = {}
>(
  reducers: R,
  config?: { selectors?: Sels; actions?: Acts }
): CombineReducerPublic<RTCAnswerOptions, Sels, Acts>;

interface SelectorWithFactory<Input = any, Props = any, Output = any>
  extends Selector<Input, Props, Output> {
  $$factory: () => Selector<Input, Props, Output>;
}

export declare function createSelector<
  Input,
  Props,
  Args extends readonly Selector<Input, Props, any>[],
  Output
>(
  ...args: [
    ...Args,
    (...inputs: { [K in keyof Args]: ReturnType<Args[K]> }) => Output
  ]
): SelectorWithFactory<Input, Props, Output>;

// Props from mapStateToProps
type MapStateToProps<SliceType, OwnProps, StateProps> = (
  slice: SliceType,
  ownProps: OwnProps
) => StateProps;

// Props from mapDispatchToProps
type MapDispatchToProps<SliceType, OwnProps, DispatchProps> = (
  dispatch: (action: any) => any,
  slice: SliceType,
  ownProps: OwnProps
) => DispatchProps;

export declare function connect<
  SliceType = any,
  StateProps = {},
  DispatchProps = {},
  OwnProps = {}
>(
  mapStateToProps?: MapStateToProps<SliceType, OwnProps, StateProps> | null,
  mapDispatchToProps?: MapDispatchToProps<
    SliceType,
    OwnProps,
    DispatchProps
  > | null,
  ...args: any[]
): <C extends React.ComponentType<any>>(
  component: C
) => React.ComponentType<
  Omit<React.ComponentProps<C>, keyof StateProps & keyof DispatchProps> &
    OwnProps
>;
