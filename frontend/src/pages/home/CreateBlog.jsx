import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreateBlog = () => {
    const [text, setText] = useState(""); // 'text' will be mapped to 'content'
    const [img, setImg] = useState(null); // 'img' will be mapped to 'image'

    const imgRef = useRef(null);

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const queryClient = useQueryClient();

    const { mutate: createBlog, isPending } = useMutation({
        mutationFn: async ({ content, image }) => {
            console.log({ content, image }); // Debugging log
            try {
                const res = await fetch("/api/v1/blog/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ content, image }), // Use 'image' instead of 'img'
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error.message || "Failed to create blog");
            }
        },
        onSuccess: () => {
            toast.success("Blog created successfully");
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            setText("");
            setImg(null);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create blog");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createBlog({ content: text, image: img }); // Map 'img' to 'image'
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImg(reader.result); // Set the Base64 string to 'img'
            };
            reader.readAsDataURL(file); // Convert the file to a Base64 string
        }
    };

    return (
        <div className="flex p-4 items-start gap-4 border-b border-gray-700">
            <div className="avatar">
                <div className="w-8 rounded-full">
                    <img src={authUser?.profilePic || "/avatar-placeholder.png"} alt="User Avatar" />
                </div>
            </div>
            <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
                <textarea
                    className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
                    placeholder="What is happening?!"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {img && (
                    <div className="relative w-72 mx-auto">
                        <IoCloseSharp
                            className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                            onClick={() => {
                                setImg(null);
                                imgRef.current.value = null;
                            }}
                        />
                        <img src={img} className="w-full mx-auto h-72 object-contain rounded" alt="Preview" />
                    </div>
                )}

                <div className="flex justify-between border-t py-2 border-t-gray-700">
                    <div className="flex gap-1 items-center">
                        <CiImageOn
                            className="fill-primary w-6 h-6 cursor-pointer"
                            onClick={() => imgRef.current.click()}
                        />
                        <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
                    </div>
                    <input type="file" accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                        {isPending ? "Uploading..." : "Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBlog;