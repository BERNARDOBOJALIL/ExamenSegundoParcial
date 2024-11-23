import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FaUpload, FaCheckCircle, FaSpinner, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { getMenu } from '../services/menuApi';
import { registerProduct, updateProduct, deleteProduct, uploadImage, deleteImage } from '../services/productService';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [availableState, setAvailableState] = useState(true);

  useEffect(() => {
    const unsubscribe = getMenu(
      (data) => setMenuItems(data),
      (error) => console.error('Error al obtener el menú:', error)
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const product = menuItems.find((item) => item.id === selectedProduct);
      if (product) {
        setProductName(product.name || '');
        setCategory(product.category || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setAvailableState(product.available || false);
      }
    } else {
      setProductName('');
      setCategory('');
      setDescription('');
      setPrice('');
      setAvailableState(true);
    }
  }, [selectedProduct, menuItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !category || !description || !price) {
      setModalMessage('Por favor, complete todos los campos.');
      setIsModalOpen(true);
      return;
    }

    const action = selectedProduct ? 'edit' : 'add';
    setConfirmationAction(() => () => handleSaveProduct(action));
    setModalMessage(
      `¿Estás seguro de que quieres ${selectedProduct ? 'actualizar' : 'registrar'} este producto?`
    );
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setConfirmationAction(() => handleDeleteProduct);
    setModalMessage('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (action) => {
    setLoading(true);
    try {
      let imageUrl = selectedProduct ? menuItems.find((item) => item.id === selectedProduct)?.image : '';

      if (imageFile) {
        if (selectedProduct && imageUrl) {
          await deleteImage(imageUrl); // Elimina la imagen anterior si se actualiza
        }
        imageUrl = await uploadImage(imageFile);
      }

      const product = {
        Name: productName,
        Category: category,
        Description: description,
        Price: parseFloat(price),
        Image: imageUrl,
        Available: availableState,
      };

      if (action === 'edit') {
        await updateProduct(selectedProduct, product);
        setModalMessage('Producto actualizado exitosamente.');
      } else {
        await registerProduct(product);
        setModalMessage('Producto registrado exitosamente.');
      }

      setProductName('');
      setCategory('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setSelectedProduct('');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setModalMessage('Error al guardar el producto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setIsModalOpen(true);
    }
  };

  const handleDeleteProduct = async () => {
    setLoading(true);
    try {
      const product = menuItems.find((item) => item.id === selectedProduct);
      if (product?.image) {
        await deleteImage(product.image); // Elimina la imagen del producto
      }
      await deleteProduct(selectedProduct);
      setModalMessage('Producto eliminado exitosamente.');
      setSelectedProduct('');
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setModalMessage('Error al eliminar el producto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      setIsModalOpen(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const closeModal = () => {
    setModalMessage('');
    setIsModalOpen(false);
    setConfirmationAction(null);
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-5">
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg border border-orange-300">
        <Tabs defaultValue="register">
          <TabsList className="flex justify-center mb-4 bg-orange-50 rounded-lg p-1">
            <TabsTrigger
              value="register"
              className="px-4 py-2 text-sm font-semibold text-orange-700 hover:text-white hover:bg-orange-500 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Registrar Producto
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="px-4 py-2 text-sm font-semibold text-orange-700 hover:text-white hover:bg-orange-500 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Editar Producto
            </TabsTrigger>
          </TabsList>

          {/* Registrar Producto */}
          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nombre del producto"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Categoría"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción"
                rows="4"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Precio"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="file-upload"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-orange-600 transition"
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
                {imageFile && <p className="text-gray-600 truncate">{imageFile.name}</p>}
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin text-white text-lg" /> : <FaCheckCircle />}
                Registrar Producto
              </button>
            </form>
          </TabsContent>

          {/* Editar Producto */}
          <TabsContent value="edit">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Seleccionar producto para editar</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nuevo nombre del producto"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Nueva categoría"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nueva descripción"
                rows="4"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nuevo precio"
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={availableState}
                onChange={(e) => setAvailableState(e.target.value === 'true')}
                className="p-3 bg-white border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="true">Disponible</option>
                <option value="false">No disponible</option>
              </select>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="file-upload"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-orange-600 transition"
                >
                  <FaUpload />
                  Subir nueva imagen
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imageFile && <p className="text-gray-600 truncate">{imageFile.name}</p>}
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin text-white text-lg" /> : <FaCheckCircle />}
                Actualizar Producto
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin text-white text-lg" /> : <FaTrash />}
                Eliminar Producto
              </button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Modal de confirmación */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">{modalMessage}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmationAction}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductForm;
