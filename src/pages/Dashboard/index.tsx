import { useEffect, useState } from "react";

import api from "../../services/api";

import { Header } from "../../components/Header";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import { FoodsContainer } from "./styles";

interface Foods {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  available: boolean;
}

export function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Foods>();

  useEffect(() => {
    api.get('foods').then(response => setFoods(response.data));
  }, []);

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  async function handleDeleteFood(id: Number) {
    const oldFoods = [...foods];

    await api.delete(`/foods/${id}`);
    const updatedFoods = oldFoods.filter(food => food.id !== id);

    setFoods(updatedFoods);
  }

  function handleEditFood(food: Foods) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  async function handleUpdateFood(food: Foods) {
    const oldFoods = [...foods];

    try {
      const updatedFood = await api.put(`/foods/${editingFood?.id}`, {
        ...editingFood,
        ...food
      });

      const updatedFoods = oldFoods.map((currentFood) => 
        currentFood.id !== updatedFood.data.id ? currentFood : updatedFood.data
      );

      setFoods(updatedFoods);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddFood(food: Foods) {
    const updatedFoods = [...foods];
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      });

      setFoods([updatedFoods, response.data]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
