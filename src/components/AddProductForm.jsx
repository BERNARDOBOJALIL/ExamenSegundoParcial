import React, { useState } from 'react';
import { db, storage } from '../services/firebaseConfig'; // Asegúrate de que firebaseConfig está correctamente configurado
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Modal from 'react-modal';
import { FaPlusCircle, FaCheckCircle, FaTimesCircle, FaUpload, FaInfoCircle, FaSpinner } from 'react-icons/fa';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !category || !description || !price || !imageFile) {
      setModalMessage('Por favor, complete todos los campos.');
      setIsModalOpen(true);
      return;
    }

    setLoading(true);

    try {
      console.log('Inicio de la subida de imagen...');
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      // Manejador de progreso y errores
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso de subida: ${progress}%`);
        },
        (error) => {
          console.error('Error durante la subida de la imagen:', error.message);
          setModalMessage('Error al subir la imagen. Inténtalo de nuevo.');
          setIsModalOpen(true);
          setLoading(false);
        },
        async () => {
          console.log('Subida completada, obteniendo URL de descarga...');
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('URL de descarga obtenida:', downloadURL);

          // Crear el producto
          const newProduct = {
            name: productName,
            category,
            description,
            price: parseFloat(price),
            image: downloadURL,
          };

          console.log('Guardando producto en Firestore...', newProduct);
          const productCollection = collection(db, 'Products');
          await addDoc(productCollection, newProduct);

          console.log('Producto guardado con éxito.');
          // Resetear campos del formulario
          setProductName('');
          setCategory('');
          setDescription('');
          setPrice('');
          setImageFile(null);

          setModalMessage('Producto registrado exitosamente.');
          setIsModalOpen(true);
        }
      );
    } catch (error) {
      console.error('Error al registrar el producto:', error.message);
      setModalMessage('Error al registrar el producto. Inténtalo de nuevo.');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Archivo seleccionado:', file.name);
      setImageFile(file);
    } else {
      console.log('No se seleccionó ningún archivo.');
    }
  };

  const closeModal = () => {
    setModalMessage('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-5">
      <div className="mb-6 p-6 bg-yellow-100 shadow rounded-lg">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaPlusCircle className="text-yellow-600" /> Agregar nuevo producto
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nombre del producto"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoría"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            rows="4"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="file-upload"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-yellow-600 transition"
            >
              <FaUpload />
              Subir imagen
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageFile && (
              <p className="text-gray-700 font-semibold text-sm truncate">{imageFile.name}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin text-white text-lg" /> : <FaCheckCircle />}
            Registrar producto
          </button>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <p className="text-gray-800 text-lg flex items-center justify-center gap-2">
          <FaInfoCircle className="text-yellow-500" /> {modalMessage}
        </p>
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={closeModal}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
          >
            <FaTimesCircle /> Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AddProductForm;
