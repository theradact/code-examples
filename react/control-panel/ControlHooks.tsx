/**
 * I wrote a control panel for the animation on my website.
 * It would also need a complete rewrite with my current knowledge.
 * 
 * What I like about it is that this pattern of adding controls with a hook composed very well with the React-Three-Fiber declarative convention
 * Instead of creating a control in the panel itself, I could use these handy hooks in a component that needed a value
 * 
 * In hindsight I should have used state management library but I stuck to the Context API which made my life much harder
 */

type ControlHookArgs = {
  label: string
  defaultValue?: any
  attachToGroupNamed?: string
  returnAs: 'state' | 'ref'
  displayValue?: boolean
  filterDisplayedValue?: (value: string, element: HTMLDivElement) => string
}

type ReturnsState = {
  returnAs: 'state'
}

type ReturnsRef = {
  returnAs: 'ref'
}

type UseSelectArgs = ControlHookArgs & {
  options: SelectOption[]
}


/**
 * This type of override allows for the return type of the function be defined by a property value of the arguments
 * This is really nice but the intellisense with this approach is not ideal
 * 
 * The value of a control can be returned as a state or reference.
 * In values that change often in a loop it is best to use the reference for performance
 * But if we change something that requires the component to re-render anyway it's better to use state
 */
export function useSelect<T extends ControlHookArgs>(args: T): T['defaultValue']
export function useSelect(args: UseSelectArgs & ReturnsState): any
export function useSelect(args: UseSelectArgs & ReturnsRef): MutableRefObject<any>
export function useSelect(args: UseSelectArgs) {
  const valueRef = useRef(args.defaultValue)
  const [valueState, setValueState] = useState(valueRef.current)

  const setValue = (value: any) => {
    valueRef.current = value
    if (args.returnAs === 'state') {
      setValueState(valueRef.current)
    }
  }

  const controlPanel = useContext(ControlPanelContext)

  useEffect(() => {
    const control = controlPanel.addControl({
      label: args.label,
      defaultValue: valueRef.current,
      type: 'select',
      options: args.options,
      callback: setValue,
    }, args.attachToGroupNamed)
    return () => controlPanel.removeControl(control.uuid)
  }, [])

  if (args.returnAs === 'state') {
    return valueState
  }
  return valueRef
}

type UseToggleArgs = ControlHookArgs & {
  defaultValue?: boolean
}

export function useToggle(args: UseToggleArgs & ReturnsState): boolean
export function useToggle(args: UseToggleArgs & ReturnsRef): MutableRefObject<boolean>
export function useToggle(args: UseToggleArgs) {
  const valueRef = useRef(args.defaultValue ?? false)
  const [valueState, setValueState] = useState(valueRef.current)
  const controlPanel = useContext(ControlPanelContext)

  const toggle = (value?: boolean) => {
    valueRef.current = typeof value === 'undefined' ? !valueRef.current : value
    if (args.returnAs === 'state') {
      setValueState(valueRef.current)
    }
  }

  useEffect(() => {
    const control = controlPanel.addControl({
      label: args.label,
      type: 'checkbox',
      defaultValue: args.defaultValue,
      callback: (value) => {
        toggle()
      },
    }, args.attachToGroupNamed)
    return () => {
      controlPanel.removeControl(control.uuid)
    }
  }, [])

  if (args.returnAs === 'state') {
    return valueState
  }
  return valueRef
}

type UseRangeArgs = ControlHookArgs & {
  min: number
  max: number
  step: number
  transitionLambda?: number
}

export function useRange(args: UseRangeArgs & ReturnsState): number
export function useRange(args: UseRangeArgs & ReturnsRef): MutableRefObject<number>
export function useRange(args: UseRangeArgs) {
  const valueRef = useRef(args.defaultValue)
  const previousValueRef = useRef(valueRef.current)
  const lastUpdatedRef = useRef(Date.now())
  const outputValueRef = useRef(valueRef.current)
  const [valueState, setValueState] = useState(valueRef.current)

  const controlPanel = useContext(ControlPanelContext)

  const setValue = (newValue: number) => {
    valueRef.current = THREE.MathUtils.clamp(newValue, args.min, args.max)
    previousValueRef.current = outputValueRef.current

    if (args.returnAs === 'state') {
      setValueState(valueRef.current)
    }

    if (typeof args.transitionLambda !== 'number') {
      outputValueRef.current = valueRef.current
    }

    lastUpdatedRef.current = Date.now()
  }

  if (typeof args.transitionLambda === 'number' && args.returnAs === 'ref') {
    useFrame(() => {
      const deltaTimeInSeconds = (Date.now() - lastUpdatedRef.current) / 1000
      outputValueRef.current = THREE.MathUtils.damp(previousValueRef.current, valueRef.current, args.transitionLambda as number, deltaTimeInSeconds)
    })
  }

  useEffect(() => {
    const control = controlPanel.addControl({
        label: args.label,
        type: 'range',
        event: 'input',
        defaultValue: valueRef.current,
        min: args.min,
        max: args.max,
        step: args.step,
        callback: (value) => setValue(Number(value)),
        displayValue: args.displayValue,
        filterDisplayedValue: args.filterDisplayedValue
    }, args.attachToGroupNamed)
    return () => {
      controlPanel.removeControl(control.uuid)
    }
  }, [])

  if (args.returnAs === 'state') {
    return valueState
  }

  return outputValueRef
}
