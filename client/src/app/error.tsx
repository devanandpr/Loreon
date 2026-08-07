"use client";

export default function Error({
  reset,
}:{
  error:Error;
  reset:()=>void;
}){

  return(
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-6">

      <h1 className="text-5xl font-bold mb-4">
        Something went wrong
      </h1>

      <button
        onClick={reset}
        className="mt-8 bg-white text-black px-6 py-3 rounded-lg"
      >
        Try Again
      </button>

    </main>
  );
}