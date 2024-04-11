import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Row, Col, Form, Button, Modal, Alert } from "react-bootstrap"; // Import Alert component from react-bootstrap

function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    itemQuantity: "",
    itemImage: null,
  });
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(
        "http://ec2-18-221-207-9.us-east-2.compute.amazonaws.com:5005/inventory"
      );
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, itemImage: e.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName || !formData.itemQuantity || !formData.itemImage) {
      toast.error("Please fill all the fields");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("itemName", formData.itemName);
    formDataToSend.append("itemQuantity", formData.itemQuantity);
    formDataToSend.append("itemImage", formData.itemImage);

    try {
      await axios.post(
        "http://ec2-18-221-207-9.us-east-2.compute.amazonaws.com:5005/inventory/add-item",
        formDataToSend
      );
      setFormData({
        itemName: "",
        itemQuantity: "",
        itemImage: null,
      });
      fetchInventoryItems();
      toast.success("Item added successfully");
      setShowAddItemForm(false);
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      itemQuantity: item.itemQuantity,
      itemImage: item.itemImage,
    });
  };

  const handleUpdateItem = async () => {
    if (!formData.itemName || !formData.itemQuantity) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      await axios.put(
        `http://ec2-18-221-207-9.us-east-2.compute.amazonaws.com:5005/inventory/update-item/${editingItem._id}`,
        {
          itemName: formData.itemName,
          itemQuantity: formData.itemQuantity,
        }
      );
      setEditingItem(null);
      fetchInventoryItems();
      toast.success("Item updated successfully");
      setFormData({
        // Reset form data after successful update
        itemName: "",
        itemQuantity: "",
        itemImage: null,
      });
    } catch (error) {
      console.error("Error updating inventory item:", error);
    }
  };
  const handleDeleteItem = async () => {
    setShowDeleteModal(false);
    try {
      await axios.delete(
        `http://ec2-18-221-207-9.us-east-2.compute.amazonaws.com:5005/inventory/delete-item/${itemIdToDelete}`
      );
      fetchInventoryItems();
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="d-flex justify-content-center">Inventory Management</h1>
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setShowAddItemForm(true)}>Add Item</Button>
      </div>
      {showAddItemForm && (
        <Form onSubmit={handleFormSubmit} className="mb-3">
          <Form.Group className="mb-3">
            <Form.Floating>
              <Form.Control
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleFormChange}
                placeholder="Item Name"
                required
              />
              <Form.Label>Item Name</Form.Label>
            </Form.Floating>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Floating>
              <Form.Control
                type="number"
                name="itemQuantity"
                value={formData.itemQuantity}
                onChange={handleFormChange}
                placeholder="Item Quantity"
                required
              />
              <Form.Label>Item Quantity</Form.Label>
            </Form.Floating>
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label className="me-3 font-weight-bold">
              Upload Image
            </Form.Label>
            <div className="flex-grow-1">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit" className="mt-2 btn-primary">
              Submit
            </Button>
          </div>
        </Form>
      )}
      <hr />
      {inventoryItems.length === 0 ? ( // Check if inventory is empty
        <Alert
          variant="info"
          className="d-flex justify-content-center font-weight-bold fs-4"
        >
          Inventory is empty
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-5 p-5">
          {inventoryItems.map((item, index) => (
            <Col key={item._id}>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  variant="top"
                  src={`http://ec2-18-221-207-9.us-east-2.compute.amazonaws.com:5005/uploads/${item.itemImage}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{item.itemName}</Card.Title>
                  <Card.Text>Quantity: {item.itemQuantity}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => handleEditItem(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setItemIdToDelete(item._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {editingItem && (
        <Modal
          show={!!editingItem}
          onHide={() => setEditingItem(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Item Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="itemQuantity"
                  value={formData.itemQuantity}
                  onChange={handleFormChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateItem}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default InventoryManagement;
