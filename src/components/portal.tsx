import * as React from "react";
import * as ReactDOM from "react-dom";

interface IProps {
  className?: string;
  el?: string;
  children: React.ReactNode;
}

/**
 * React portal based on https://stackoverflow.com/a/59154364
 * @param children Child elements
 * @param className CSS classname
 * @param el HTML element to create.  default: div
 */
const Portal: React.FC<IProps> = ({
  children,
  className = "root-portal",
  el = "div",
}: IProps) => {
  const [container] = React.useState(document.createElement(el));

  if (className) container.classList.add(className);

  React.useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  return ReactDOM.createPortal(children, container);
};

export default Portal;
