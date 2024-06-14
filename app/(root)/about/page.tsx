import { AppRouterPath } from "@/constants";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto px-10 mt-20 text-center text-[12px] opacity-60">
      <h1 className="text-xl font-bold mb-4">My Voc</h1>
      <p className="mb-2">
        The application <span className="font-semibold">My Voc</span> is created by
      </p>
      <p className="text-sm mb-2">Timothy Rebesh</p>
      <p className="mb-2">
        Here, you can create your own vocabularies by adding your own words. Now you will have your own vocabularies with your own topics.
      </p>
      <p className="mb-2">
        You can share your vocabularies in the
        <Link href={AppRouterPath.LIBRARY} className="font-semibold pl-1">
          Library
        </Link>
        , as well as download the vocabularies you need.
      </p>
    </div>
  );
}
