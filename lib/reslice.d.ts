export type Slice<R> = R extends MappedReducerInternal<
  infer St,
  infer C,
  infer Sels,
  infer Acts
>
  ? St extends Array<any>
    ? Array<Slice<C>> & Sels & Acts // array of children, plus selectors/actions
    : St & Slice<C> & Sels & Acts // normal state
  : R extends BoundReducerInternal<infer S, infer A>
  ? S & A
  : R extends Selectors
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
interface BoundReducerInternal<
  S = {},
  Sels extends Selectors = {},
  A extends Actions = {}
> {
  $$bind: true;
  $$reducer: (state: S, action: any) => S;
  $$state: S;
  $$selectors: Sels;
  $$actions: A;
}

interface MappedReducerInternal<
  S,
  Child extends Selectors = {},
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
type BoundReducerPublic<S, Sels, A> = S & Sels & A;
type MappedReducerPublic<S, C, Sels, Acts> = S & Slice<C> & Sels & Acts;

// Bind reducer
export declare function bindReducer<
  S,
  Sels extends Selectors = {},
  Acts extends Actions = {}
>(
  reducer: (state: S, action: any) => S,
  config?: { selectors?: Sels; actions?: Acts }
): BoundReducerInternal<S, Sels, Acts>;

export declare function mappedReducer<
  S,
  Child extends Selectors,
  Sels extends Selectors = {},
  Acts extends Actions = {}
>(
  reducer: (state: S, action: any) => S,
  child: Child,
  config?: { selectors?: Sels; actions?: Acts }
): MappedReducerInternal<S, Child, Sels, Acts> &
  MappedReducerPublic<S, Child, Sels, Acts>;

// Internal shape for combineReducers (never exposed)
interface CombineReducerInternal<
  R extends Selectors,
  Sels extends Selectors = {},
  Acts extends Actions = {}
> {
  $$combine: true;
  $$reducers: R;
  $$selectors: Sels;
  $$actions: Acts;
}

// Public facade: merges state + actions + selectors
type CombineReducerPublic<R extends Selectors, Sels, Acts> = Slice<R> &
  Sels &
  Acts;

export declare function combineReducers<
  R extends Selectors,
  Sels extends Selectors = {},
  Acts extends Actions = {}
>(
  reducers: R,
  config?: { selectors?: Sels; actions?: Acts }
): CombineReducerInternal<RTCAnswerOptions, Sels, Acts> &
  CombineReducerPublic<RTCAnswerOptions, Sels, Acts>;

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
