"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function useFirebaseUpload() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const uploadImage = (file: File): Promise<string> => {
    console.log("bucket:");
    console.log(storage.app.options.storageBucket);

    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `products/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      setLoading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgress(progressPercent);
        },
        (error) => {
          setLoading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          setUrl(downloadURL);
          setLoading(false);

          resolve(downloadURL);
        },
      );
    });
  };

  const uploadFile = (
    file: File,
    folder: string = "uploads",
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      setLoading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgress(progressPercent);
        },
        (error) => {
          setLoading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          setUrl(downloadURL);
          setLoading(false);

          resolve(downloadURL);
        },
      );
    });
  };

  const uploadFile = (
    file: File,
    folder: string = "uploads"
  ): Promise<string> => {

    return new Promise((resolve, reject) => {

      const fileName = `${Date.now()}-${file.name}`
      const storageRef = ref(storage, `${folder}/${fileName}`)

      const uploadTask = uploadBytesResumable(storageRef, file)

      setLoading(true)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progressPercent =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setProgress(progressPercent)
        },
        (error) => {
          setLoading(false)
          reject(error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

          setUrl(downloadURL)
          setLoading(false)

          resolve(downloadURL)
        }
      )
    })
  }

  return {
    uploadImage,
    uploadFile,
    progress,
    loading,
    url,
  };
}
