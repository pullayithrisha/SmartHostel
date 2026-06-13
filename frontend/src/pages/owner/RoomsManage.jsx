import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, createRoom, updateRoom, deleteRoom, selectRoom, clearRoomErrors } from '../../store/roomSlice';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { Edit2, Trash2, Plus, Search, Filter, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomsManage = () => {
  const dispatch = useDispatch();
  const { data: rooms, loading } = useSelector(selectRoom);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'single',
    floor: '',
    rent: '',
    amenities: '',
    status: 'available'
  });

  const [formErrors, setFormErrors] = useState({});
  const [expandedRoomId, setExpandedRoomId] = useState(null);

  const toggleRoomExpand = (id) => {
    setExpandedRoomId(prev => prev === id ? null : id);
  };

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        roomNumber: room.roomNumber,
        type: room.type,
        floor: room.floor.toString(),
        rent: room.rent.toString(),
        amenities: room.amenities.join(', '),
        status: room.status
      });
    } else {
      setEditingRoom(null);
      setFormData({
        roomNumber: '',
        type: 'single',
        floor: '',
        rent: '',
        amenities: 'AC, WiFi, Attached Bathroom',
        status: 'available'
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.roomNumber.trim()) errs.roomNumber = 'Room number is required.';
    if (!formData.floor.trim() || isNaN(formData.floor)) errs.floor = 'Valid floor number is required.';
    if (!formData.rent.trim() || isNaN(formData.rent)) errs.rent = 'Valid monthly rent is required.';
    
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      roomNumber: formData.roomNumber.trim(),
      type: formData.type,
      floor: Number(formData.floor),
      rent: Number(formData.rent),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      status: formData.status
    };

    if (editingRoom) {
      dispatch(updateRoom({ id: editingRoom._id, roomData: payload }))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Room updated successfully.');
          dispatch(fetchRooms());
          handleCloseModal();
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      dispatch(createRoom(payload))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Room created successfully.');
          dispatch(fetchRooms());
          handleCloseModal();
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleDelete = (room) => {
    if (room.status !== 'available') {
      toast.error('Cannot delete an occupied or maintenance room.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
      dispatch(deleteRoom(room._id))
        .unwrap()
        .then((res) => {
          toast.success(res.message || 'Room deleted successfully.');
          dispatch(fetchRooms());
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  // Filtered rooms list
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? room.status === statusFilter : true;
    const matchesType = typeFilter ? room.type === typeFilter : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Room */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Rooms</h2>
          <p className="text-xs text-gray-500 mt-1">Add, update, and manage hostel room assets.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={12} /> Type:
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white"
          >
            <option value="">All Types</option>
            <option value="single">Single Sharing</option>
            <option value="double">Double Sharing</option>
            <option value="triple">Triple Sharing</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-36 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Loading & Room Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#534AB7]" size={36} />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          <p className="text-3xl mb-3">🚪</p>
          <p className="text-sm font-semibold">No rooms found.</p>
          <p className="text-xs text-gray-400 mt-1">Try resetting your filters or click "Add Room" above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredRooms.map((room) => {
            const isOpen = expandedRoomId === room._id;
            const statusColor = room.status === 'available' ? 'bg-green-400' : room.status === 'occupied' ? 'bg-amber-400' : 'bg-red-400';
            return (
              <div key={room._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Slim row header */}
                <button
                  onClick={() => toggleRoomExpand(room._id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${statusColor} shrink-0`} />
                    <div>
                      <p className="font-bold text-gray-800 text-sm leading-tight">Room {room.roomNumber}</p>
                      <p className="text-[10px] text-gray-400">Floor {room.floor} • {room.type} sharing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-extrabold text-gray-700 hidden sm:block">₹{room.rent}/mo</span>
                    <Badge status={room.status} />
                    {isOpen ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/30 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Rent</span>
                        <span className="text-gray-800 font-bold">₹{room.rent}/mo</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Type</span>
                        <span className="text-gray-800 font-bold capitalize">{room.type} sharing</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Floor</span>
                        <span className="text-gray-800 font-bold">Floor {room.floor}</span>
                      </div>
                      {room.occupants?.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">Occupants ({room.occupants.length})</span>
                          <span className="text-gray-800 font-bold">{room.occupants.map(o => o.name).join(', ')}</span>
                        </div>
                      )}
                      {room.amenities?.length > 0 && (
                        <div className="col-span-2 sm:col-span-3">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">Amenities</span>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.map((a, i) => <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{a}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenModal(room)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#534AB7] text-xs font-bold rounded-lg border border-purple-200 transition-colors"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Room Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                  formErrors.roomNumber
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                }`}
                placeholder="e.g. 101"
              />
              {formErrors.roomNumber && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.roomNumber}</p>}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sharing Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white"
              >
                <option value="single">Single Sharing</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Floor */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Floor Level</label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                  formErrors.floor
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                }`}
                placeholder="e.g. 1"
              />
              {formErrors.floor && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.floor}</p>}
            </div>

            {/* Rent */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Monthly Rent (INR)</label>
              <input
                type="text"
                name="rent"
                value={formData.rent}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 ${
                  formErrors.rent
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#534AB7] focus:ring-[#534AB7]'
                }`}
                placeholder="e.g. 5000"
              />
              {formErrors.rent && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.rent}</p>}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Amenities</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7]"
              placeholder="Comma separated: AC, WiFi, Bathroom..."
            />
            <p className="text-[10px] text-gray-400 mt-1">Type values separated by commas.</p>
          </div>

          {/* Status (Only available in Edit mode to prevent inconsistency on creation) */}
          {editingRoom && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Room Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={editingRoom?.occupants?.length > 0}
                className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-1 focus:ring-[#534AB7] bg-white ${editingRoom?.occupants?.length > 0 ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <p className={`text-[10px] mt-1 font-medium ${editingRoom?.occupants?.length > 0 ? 'text-amber-500' : 'text-red-400'}`}>
                {editingRoom?.occupants?.length > 0 
                  ? 'Status cannot be changed manually while occupants are assigned. Remove students first.' 
                  : 'Note: Setting status to Available/Maintenance clears any occupant assignments.'}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold rounded-xl shadow-md transition-colors text-sm"
            >
              Save Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomsManage;
