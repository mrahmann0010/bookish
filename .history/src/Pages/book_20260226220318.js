import React, { useEffect, useState } from "react";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { FaStar, FaShareAlt } from "react-icons/fa";
import { Button } from "../components/Button";
import { useParams } from "react-router-dom";

export default function IndBook({ books, readLater, setReadLater }) {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!books || !books.length) return;
    const selected = books.find((b) => b.id.toString() === id);
    if (!selected) return;
    setIsLoading(true);
    async function fetchDetails() {
      try {
        const res = await fetch(`https://openlibrary.org${selected.key}.json`);
        const data = await res.json();
        const description =
          typeof data.description === "object"
            ? data.description.value
            : data.description;
        setBookData({
          ...selected,
          description: description || "No description available",
          coverImg: selected.cover_i
            ? `https://covers.openlibrary.org/b/id/${selected.cover_i}-L.jpg`
            : "/placeholder.png",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails();
  }, [books, id]);

  const handleAdd = () => {
    if (!bookData) return;
    if (!readLater.find((item) => item.key === bookData.key)) {
      setReadLater((prev) => [...prev, bookData]);
      if (auth.currentUser) {
        const { title, key, description } = bookData;
        const user = auth.currentUser.email;
        const userId = auth.currentUser.uid;
        const bookCol = collection(db, "Books");
        addDoc(bookCol, { title, key, description, user, userId });
      }
    }
  };

  if (isLoading || !bookData) {
    return <p className="p-8 text-center">Loading...</p>;
  }

  const alreadyAdded = readLater.some((item) => item.key === bookData.key);

  return (
    <div className="max-w-container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8 bg-white bg-opacity-90 rounded-3xl shadow-xl p-8">
        <img
          src={bookData.coverImg}
          alt={bookData.title}
          className="w-full max-w-xs lg:max-w-md h-auto aspect-[3/4] rounded-2xl shadow-lg object-cover mx-auto lg:mx-0 border border-[#e0e7ef]"
        />
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <h1 className="text-3xl font-extrabold text-[#232946] mb-2">
            {bookData.title}
          </h1>
          <p className="text-lg text-[#6b7280] mb-1">
            {bookData.author_name?.join(", ") || "Unknown author"}
          </p>
          <div className="flex items-center gap-4 mb-2">
            <FaStar className="text-[#fbbf24] text-2xl" />
            <span className="text-lg font-semibold text-[#232946]">
              {bookData.ratings_average
                ? bookData.ratings_average.toFixed(1)
                : "N/A"}
            </span>
          </div>
          <p className="text-md text-[#3a3a3a] leading-relaxed bg-[#f8fafc] rounded-xl p-4 shadow-sm">
            {bookData.description}
          </p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <Button onClick={handleAdd} disabled={alreadyAdded} className="bg-[#6a82fb] text-white font-bold px-6 py-2 rounded-xl shadow-md hover:bg-[#5a6ee3]">
              {alreadyAdded ? "Added" : "Add to Reading List"}
            </Button>
            <Button className="bg-[#22c55e] text-white font-bold px-6 py-2 rounded-xl shadow-md hover:bg-[#16a34a]">
              Preview
            </Button>
            <Button className="bg-white text-[#6a82fb] border border-[#6a82fb] font-bold px-6 py-2 rounded-xl shadow-md hover:bg-[#e0e7ef]">
              <FaShareAlt className="inline mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
