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
      <div className="flex flex-col lg:flex-row gap-8">
        <img
          src={bookData.coverImg}
          alt={bookData.title}
          className="w-full max-w-xs lg:max-w-md h-auto max-h-[420px] rounded-2xl shadow-lg object-cover mx-auto lg:mx-0"
        />
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-section font-bold text-textPrimary">
            {bookData.title}
          </h1>
          <p className="text-body text-textSecondary">
            {bookData.author_name?.join(", ") || "Unknown author"}
          </p>
          <div className="flex items-center gap-4">
            <FaStar className="text-yellow-400" />
            <span className="text-body">
              {bookData.ratings_average
                ? bookData.ratings_average.toFixed(1)
                : "N/A"}
            </span>
          </div>
          <p className="text-body">{bookData.description}</p>
          <div className="mt-6 flex gap-4 flex-wrap">
            <Button onClick={handleAdd} disabled={alreadyAdded}>
              {alreadyAdded ? "Added" : "Add to Reading List"}
            </Button>
            <Button className="bg-secondary hover:bg-secondary/90">
              Preview
            </Button>
            <Button className="bg-white text-primary border border-primary hover:bg-primary/10">
              <FaShareAlt className="inline mr-2" /> Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
