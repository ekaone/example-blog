import { useContext } from 'react'

const rePath = (path) => {
  const withParams = path.replace(/:([^\/]+)/g, '(?<$1>[^/]+)')
  const fullString = `^${withParams}$`
  return fullString
}

const createNamedContext = (name, defaultValue) => {
  const Ctx = React.createContext(defaultValue)
  Ctx.displayName = name
  return Ctx
}

const LocationContext = createNamedContext('Location')

const Location = ({ children }) => (
  <LocationContext.Consumer>
    {(context) =>
      context ? (
        children(context)
      ) : (
        <LocationProvider>{children}</LocationProvider>
      )
    }
  </LocationContext.Consumer>
)

class LocationProvider extends React.Component {
  static defaultProps = {
    pathname: window.location.pathname,
  }

  constructor(props) {
    super(props)
    this.state = {
      context: {
        pathname: this.props.pathname,
      },
    }
  }

  render() {
    let { children } = this.props
    let { context } = this.state
    return (
      <LocationContext.Provider value={context}>
        {typeof children === 'function' ? children(context) : children || null}
      </LocationContext.Provider>
    )
  }
}

export const Router = (props) => (
  <Location>
    {(locationContext) => <RouterImpl {...locationContext} {...props} />}
  </Location>
)

const ParamsContext = createNamedContext('Params', {})

// The first time the routes are loaded, iterate through them and create the named
// route functions.

let namedRoutes = {}
let namedRoutesDone = false

const mapNamedRoutes = (routes) => {
  for (let route of routes) {
    const { path, name, notfound } = route.props
    if (notfound) {
      continue
    }
    namedRoutes[name] = (args = {}) => {
      let newPath = path
      Object.keys(args).forEach((key) => {
        newPath = newPath.replace(`:${key}`, args[key])
      })
      return newPath
    }
  }
  namedRoutesDone = true
}

export const routes = namedRoutes

// The guts of the router implementation.

const RouterImpl = ({ pathname, children }) => {
  const routes = React.Children.toArray(children)
  if (!namedRoutesDone) {
    mapNamedRoutes(routes)
  }

  let NotFoundPage

  for (let route of routes) {
    const { path, page: Page, notfound } = route.props
    if (notfound) {
      NotFoundPage = Page
      continue
    }
    const matches = Array.from(pathname.matchAll(rePath(path)))
    if (matches.length > 0) {
      const pathProps = matches[0].groups
      return (
        <ParamsContext.Provider value={pathProps || {}}>
          <Page {...pathProps} />
        </ParamsContext.Provider>
      )
    }
  }

  return (
    <ParamsContext.Provider value={{}}>
      <NotFoundPage />
    </ParamsContext.Provider>
  )
}

export const Route = () => {
  return null
}

export const Link = ({ to, ...rest }) => <a href={to} {...rest} />

export const NavLink = ({ to, ...rest }) => <a href={to} {...rest} />

export const useParams = () => {
  const params = useContext(ParamsContext)
  return params
}