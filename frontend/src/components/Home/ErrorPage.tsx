import { Ghost } from "lucide-react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="w-full h-[100%]">
      <section className="bg-white flex flex-col items-center justify-center w-full h-full">
        <div className="py-8 px-4 mx-auto w-full h-full lg:py-16 lg:px-6">
          <div className="mx-auto h-full flex flex-col text-center justify-center gap-4">
            <div>
              <h1 className="mb-4 text-6xl tracking-tight font-extrabold lg:text-9xl gradient-text">
                Oops
              </h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-secondary md:text-4xl">
                Esta página está com problemas.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <Ghost className="text-destructive w-8 h-8 " />
              <p className="mb-4 text-2xl lg:text-3xl font-semibold -tracking-wide text-destructive">
                {error.statusText}
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex w-fit h-fit text-white bg-button hover:bg-buttonhover font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
