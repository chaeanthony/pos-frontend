import { useState, useEffect } from 'react';
import { getItems, updateItem, createItem, deleteItem, type MenuItem } from '../api/item';

export default function EditMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError('Failed to load menu items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      cost: parseFloat(formData.get('cost') as string),
    };

    try {
      await updateItem(itemData);
      // Refresh the items list
      fetchItems();
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
    }
  };

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      cost: parseFloat(formData.get('cost') as string),
    };

    try {
      await createItem(itemData);
      setShowNewItemForm(false);
      // Refresh the items list
      fetchItems();
    } catch (err) {
      setError('Failed to create item');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteItem(id);
      // Refresh the items list
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Menu</h1>
        <button
          onClick={() => setShowNewItemForm(!showNewItemForm)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showNewItemForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {showNewItemForm && (
        <form onSubmit={handleCreateItem} className="border p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cost</label>
            <input
              type="number"
              name="cost"
              step="0.01"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Item
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <form key={item.id} onSubmit={handleSubmit} className="border p-4 rounded-lg relative">
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <input type="hidden" name="id" value={item.id} />
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                defaultValue={item.name}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={item.description}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Cost</label>
              <input
                type="number"
                name="cost"
                step="0.01"
                defaultValue={item.cost}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Item
            </button>
          </form>
        ))}
      </div>
    </div>
  );
} 