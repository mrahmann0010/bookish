import React, { useEffect, useState } from "react";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { FaStar, FaShareAlt, FaUserEdit } from "react-icons/fa";
import { Button } from "../components/Button";
import { useParams, Link } from "react-router-dom";

// ── Metadata item ──────────────────────────────────────────────
const MetaItem = ({ label, value }) =>
  value ? (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          color: "#8C7B6B",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
          color: "#1C1612",
        }}
      >
        {value}
      </span>
    </div>
  ) : null;

// ── Subject tag pill ───────────────────────────────────────────
const Tag = ({ label }) => (
  <span
    className="inline-block px-2.5 py-1 rounded-[3px] text-xs"
    style={{
      background: "#EDE6D6",
      color: "#C9813A",
      border: "1px solid #D9CEBB",
      fontFamily: "'DM Mono', monospace",
      fontSize: "11px",
    }}
  >
    {label}
  </span>
);

export default function IndBook({ books, readLater, setReadLater }) {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        let selected = null;
        if (books && books.length) {
          selected = books.find((b) => b.id.toString() === id);
        }
        let key             = selected ? selected.key : null;
        let author_name     = selected ? selected.author_name : [];
        let cover_i         = selected ? selected.cover_i : null;
        let ratings_average = selected ? selected.ratings_average : null;
        let title           = selected ? selected.title : null;
        let first_published = selected ? selected.first_published : null;
        let subject_facet   = selected ? selected.subject_facet : [];

        if (!key) {
          const searchRes = await fetch(
            `https://openlibrary.org/search.json?q=${id}`
          );
          const searchData = await searchRes.json();
          const found = searchData.docs.find(
            (b) => b.id && b.id.toString() === id
          );
          if (found) {
            key             = found.key;
            author_name     = found.author_name;
            cover_i         = found.cover_i;
            ratings_average = found.ratings_average;
            title           = found.title;
            first_published = found.first_published_year;
            subject_facet   = found.subject_facet;
          }
        }
        if (!key) {
          setBookData(null);
          setIsLoading(false);
          return;
        }
        const res  = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        const description =
          typeof data.description === "object"
            ? data.description.value
            : data.description;

        setBookData({
          key,
          author_name,
          cover_i,
          ratings_average,
          title,
          first_published,
          subject_facet: subject_facet?.slice(0, 6) || [],
          description:   description || "No description available.",
          coverImg:      cover_i
            ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
            : null,
        });
      } catch (err) {
        console.error(err);
        setBookData(null);
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
        const user   = auth.currentUser.email;
        const userId = auth.currentUser.uid;
        addDoc(collection(db, "Books"), { title, key, description, user, userId });
      }
    }
  };

  const handleRemove = () => {
    if (!bookData) return;
    setReadLater((prev) => prev.filter((b) => b.key !== bookData.key));
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F5F0E8" }}
      >
        <div className="text-center">
          <div
            className="inline-block w-10 h-10 rounded-full border-2 border-t-amber animate-spin mb-4"
            style={{ borderColor: "#D9CEBB", borderTopColor: "#C9813A" }}
          />
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px",
              color: "#8C7B6B",
            }}
          >
            Fetching book details&hellip;
          </p>
        </div>
      </div>
    );
  }

  if (!bookData) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#F5F0E8" }}
      >
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#8C7B6B" }}>
          Book not found.
        </p>
        <Link
          to="/"
          className="text-sm underline"
          style={{ color: "#C9813A", fontFamily: "'DM Mono', monospace" }}
        >
          ← Back to search
        </Link>
      </div>
    );
  }

  const alreadyAdded = readLater.some((item) => item.key === bookData.key);

  return (
    <div
      className="min-h-screen diagonal-rules"
      style={{ background: "#F5F0E8", paddingTop: "64px" }}
    >
      <div className="max-w-container mx-auto px-6 py-14">
        {/* Breadcrumb */}
        <nav
          className="mb-10 text-xs tracking-wide"
          style={{ fontFamily: "'DM Mono', monospace", color: "#8C7B6B" }}
        >
          <Link to="/" className="hover:text-amber transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <span>Search Results</span>
          <span className="mx-2">›</span>
          <span
            className="line-clamp-1 inline"
            style={{ color: "#1C1612", maxWidth: "180px" }}
          >
            {bookData.title}
          </span>
        </nav>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* ── LEFT: Cover + Actions + Metadata ── */}
          <div className="flex-shrink-0 w-full lg:w-[340px]">
            {/* Cover */}
            <div className="flex justify-center lg:justify-start mb-6">
              {bookData.coverImg ? (
                <img
                  src={bookData.coverImg}
                  alt={bookData.title}
                  className="rounded-[6px]"
                  style={{
                    width: "240px",
                    height: "auto",
                    boxShadow: "8px 10px 32px rgba(28,22,18,0.22)",
                    transform: "rotate(2deg)",
                    border: "1px solid #D9CEBB",
                  }}
                />
              ) : (
                <div
                  className="rounded-[6px] flex items-center justify-center"
                  style={{
                    width: "240px",
                    height: "360px",
                    background: "#EDE6D6",
                    border: "1px solid #D9CEBB",
                    transform: "rotate(2deg)",
                    boxShadow: "8px 10px 32px rgba(28,22,18,0.14)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "40px",
                      color: "#C9813A",
                      opacity: 0.5,
                    }}
                  >
                    {bookData.title?.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Add / Remove button */}
            <div className="flex flex-col gap-3 mb-8">
              {alreadyAdded ? (
                <Button
                  variant="secondary"
                  onClick={handleRemove}
                  className="w-full justify-center"
                >
                  ✓ In your list
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAdd}
                  className="w-full justify-center"
                >
                  + Add to Reading List
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={() => {
                  if (navigator.share)
                    navigator.share({ title: bookData.title, url: window.location.href });
                }}
              >
                <FaShareAlt className="mr-2 text-xs" /> Share
              </Button>
            </div>

            {/* Metadata card */}
            <div
              className="rounded-[6px] p-5 grid grid-cols-2 gap-4"
              style={{
                background: "#EDE6D6",
                border: "1px solid #D9CEBB",
                boxShadow: "4px 6px 20px rgba(28,22,18,0.06)",
              }}
            >
              <MetaItem label="Year" value={bookData.first_published} />
              {bookData.ratings_average && (
                <MetaItem
                  label="Rating"
                  value={`★ ${bookData.ratings_average.toFixed(1)}`}
                />
              )}
            </div>
          </div>

          {/* ── RIGHT: Title, Description, Tags ── */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1
              className="mb-3 leading-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "clamp(26px, 4vw, 40px)",
                color: "#1C1612",
              }}
            >
              {bookData.title}
            </h1>

            {/* Author */}
            <p
              className="flex items-center gap-2 mb-6"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                color: "#C9813A",
              }}
            >
              <FaUserEdit size={16} />
              {bookData.author_name?.join(", ") || "Unknown Author"}
            </p>

            {/* Rating row */}
            {bookData.ratings_average && (
              <div
                className="flex items-center gap-2 mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={16}
                    style={{
                      color:
                        star <= Math.round(bookData.ratings_average)
                          ? "#C9813A"
                          : "#D9CEBB",
                    }}
                  />
                ))}
                <span
                  style={{ fontSize: "14px", color: "#8C7B6B", marginLeft: "6px" }}
                >
                  {bookData.ratings_average.toFixed(1)} / 5
                </span>
              </div>
            )}

            {/* Amber divider */}
            <div
              className="mb-7"
              style={{ height: "1.5px", background: "#C9813A", opacity: 0.35 }}
            />

            {/* Description */}
            <p
              className="mb-8 leading-relaxed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "16px",
                color: "#1C1612",
                lineHeight: 1.85,
              }}
            >
              {bookData.description}
            </p>

            {/* Subject tags */}
            {bookData.subject_facet?.length > 0 && (
              <div>
                <p
                  className="mb-3 text-xs tracking-widest uppercase"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    color: "#8C7B6B",
                  }}
                >
                  Subjects
                </p>
                <div className="flex flex-wrap gap-2">
                  {bookData.subject_facet.map((tag, i) => (
                    <Tag key={i} label={tag} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IndBook({ books, readLater, setReadLater }) {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        let selected = null;
        if (books && books.length) {
          selected = books.find((b) => b.id.toString() === id);
        }
        let key = selected ? selected.key : null;
        let author_name = selected ? selected.author_name : [];
        let cover_i = selected ? selected.cover_i : null;
        let ratings_average = selected ? selected.ratings_average : null;
        let title = selected ? selected.title : null;
        let first_published = selected ? selected.first_published : null;
        // If no key, try to fetch from OpenLibrary search API
        if (!key) {
          // fallback: fetch by id from OpenLibrary
          const searchRes = await fetch(
            `https://openlibrary.org/search.json?q=${id}`,
          );
          const searchData = await searchRes.json();
          const found = searchData.docs.find(
            (b) => b.id && b.id.toString() === id,
          );
          if (found) {
            key = found.key;
            author_name = found.author_name;
            cover_i = found.cover_i;
            ratings_average = found.ratings_average;
            title = found.title;
            first_published = found.first_published_year;
          }
        }
        if (!key) {
          setBookData(null);
          setIsLoading(false);
          return;
        }
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        const description =
          typeof data.description === "object"
            ? data.description.value
            : data.description;
        setBookData({
          key,
          author_name,
          cover_i,
          ratings_average,
          title,
          first_published,
          description: description || "No description available",
          coverImg: cover_i
            ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
            : "/placeholder.png",
        });
      } catch (err) {
        console.error(err);
        setBookData(null);
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
            <Button
              onClick={handleAdd}
              disabled={alreadyAdded}
              className="bg-[#6a82fb] text-white font-bold px-6 py-2 rounded-xl shadow-md hover:bg-[#5a6ee3]"
            >
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
