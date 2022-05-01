import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useSelector, shallowEqual } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectHasActiveSession } from "../../reducers/app-slice";

interface IProtectedRouteProps {
  children: ReactJSXElement;
  redirectPath: string;
  rest?: { [keyof: string]: any };
}
export function ProtectedRoute(props: IProtectedRouteProps) {
  const hasSession = useSelector(selectHasActiveSession, shallowEqual);
  return hasSession ? props.children : <Navigate to={props.redirectPath} />;
}

export default ProtectedRoute;
