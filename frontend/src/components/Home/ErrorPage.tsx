import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="min-h-screen bg-gray-200 w-full flex flex-col items-center justify-center gap-1 text-navbar"
    >
      <h1 className="text-2xl">Oops!</h1>
      <p className="text-lg">Sorry, an unexpected error has occurred.</p>
      <p>
        <i className="text-red-800 text-lg text-center px-2">{error.statusText ?? error.message}</i>
      </p>
    </div>
  );
}
