/// <reference types="jest" />
import Seat from '../../models/Seat';

/**
 * Integration tests for seat management flow
 * Tests the complete seat retrieval, filtering, and status update flow
 */
describe('Seat Integration Tests', () => {
  beforeEach(async () => {
    // Clear seats collection before each test
    await Seat.deleteMany({});
  });

  describe('Seat Retrieval Flow', () => {
    it('should retrieve all active seats', async () => {
      // Create test seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-1',
          zoneType: 'Island',
          status: 'occupied',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'cub-1-A-0',
          zoneType: 'Cubicle',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Retrieve all active seats
      const retrievedSeats = await Seat.find({
        isDeleted: false,
        isActive: true,
      }).lean();

      expect(retrievedSeats).toHaveLength(3);
      expect(retrievedSeats.map(s => s.seatCode)).toContain('isl-1-L-0');
      expect(retrievedSeats.map(s => s.seatCode)).toContain('cub-1-A-0');
    });

    it('should exclude deleted seats', async () => {
      // Create active and deleted seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-1',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: true, // Deleted
        },
      ];

      await Seat.insertMany(seats);

      // Retrieve only active seats
      const retrievedSeats = await Seat.find({
        isDeleted: false,
        isActive: true,
      });

      expect(retrievedSeats).toHaveLength(1);
      expect(retrievedSeats[0].seatCode).toBe('isl-1-L-0');
    });

    it('should exclude inactive seats', async () => {
      // Create active and inactive seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-1',
          zoneType: 'Island',
          status: 'available',
          isActive: false, // Inactive
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Retrieve only active seats
      const retrievedSeats = await Seat.find({
        isDeleted: false,
        isActive: true,
      });

      expect(retrievedSeats).toHaveLength(1);
      expect(retrievedSeats[0].seatCode).toBe('isl-1-L-0');
    });
  });

  describe('Seat Filtering by Zone', () => {
    it('should filter seats by zone type', async () => {
      // Create seats in different zones
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-1',
          zoneType: 'Island',
          status: 'occupied',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'cub-1-A-0',
          zoneType: 'Cubicle',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'wall-1-W-0',
          zoneType: 'Wall',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Filter by Island zone
      const islandSeats = await Seat.find({
        zoneType: { $regex: /^island$/i },
        isDeleted: false,
      });

      expect(islandSeats).toHaveLength(2);
      expect(islandSeats.every(s => s.zoneType === 'island')).toBe(true);
    });

    it('should be case-insensitive when filtering by zone', async () => {
      // Create seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Filter with different case
      const retrievedSeats = await Seat.find({
        zoneType: { $regex: /^island$/i },
        isDeleted: false,
      });

      expect(retrievedSeats).toHaveLength(1);
      expect(retrievedSeats[0].seatCode).toBe('isl-1-L-0');
    });

    it('should return empty array for non-existent zone', async () => {
      // Create seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Filter by non-existent zone
      const retrievedSeats = await Seat.find({
        zoneType: { $regex: /^nonexistent$/i },
        isDeleted: false,
      });

      expect(retrievedSeats).toHaveLength(0);
    });
  });

  describe('Seat Status Update Flow', () => {
    it('should update seat status', async () => {
      // Create a seat
      const seat = new Seat({
        seatCode: 'isl-1-L-0',
        zoneType: 'Island',
        status: 'available',
        isActive: true,
        isDeleted: false,
      });

      await seat.save();

      // Update status
      const updatedSeat = await Seat.findOneAndUpdate(
        { seatCode: 'isl-1-L-0', isDeleted: false },
        { status: 'occupied' },
        { new: true }
      );

      expect(updatedSeat).toBeDefined();
      expect(updatedSeat?.status).toBe('occupied');
    });

    it('should not update deleted seat', async () => {
      // Create a deleted seat
      const seat = new Seat({
        seatCode: 'isl-1-L-0',
        zoneType: 'Island',
        status: 'available',
        isActive: true,
        isDeleted: true,
      });

      await seat.save();

      // Try to update
      const updatedSeat = await Seat.findOneAndUpdate(
        { seatCode: 'isl-1-L-0', isDeleted: false },
        { status: 'occupied' },
        { new: true }
      );

      expect(updatedSeat).toBeNull();
    });

    it('should handle multiple status updates', async () => {
      // Create a seat
      const seat = new Seat({
        seatCode: 'isl-1-L-0',
        zoneType: 'Island',
        status: 'available',
        isActive: true,
        isDeleted: false,
      });

      await seat.save();

      // Update to occupied
      let updatedSeat = await Seat.findOneAndUpdate(
        { seatCode: 'isl-1-L-0', isDeleted: false },
        { status: 'occupied' },
        { new: true }
      );

      expect(updatedSeat?.status).toBe('occupied');

      // Update back to available
      updatedSeat = await Seat.findOneAndUpdate(
        { seatCode: 'isl-1-L-0', isDeleted: false },
        { status: 'available' },
        { new: true }
      );

      expect(updatedSeat?.status).toBe('available');
    });
  });

  describe('Seat Availability Aggregation', () => {
    it('should aggregate available seats by zone', async () => {
      // Create seats with different statuses
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-1',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-2',
          zoneType: 'Island',
          status: 'occupied',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'cub-1-A-0',
          zoneType: 'Cubicle',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Aggregate available seats by zone
      const availability = await Seat.aggregate([
        { $match: { status: 'available', isDeleted: false, isActive: true } },
        { $group: { _id: '$zoneType', count: { $sum: 1 } } },
      ]);

      expect(availability).toHaveLength(2);

      const islandAvail = availability.find(a => a._id === 'Island');
      expect(islandAvail?.count).toBe(2);

      const cubicleAvail = availability.find(a => a._id === 'Cubicle');
      expect(cubicleAvail?.count).toBe(1);
    });

    it('should not count occupied seats in availability', async () => {
      // Create seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'available',
          isActive: true,
          isDeleted: false,
        },
        {
          seatCode: 'isl-1-L-1',
          zoneType: 'Island',
          status: 'occupied',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Aggregate available seats
      const availability = await Seat.aggregate([
        { $match: { status: 'available', isDeleted: false, isActive: true } },
        { $group: { _id: '$zoneType', count: { $sum: 1 } } },
      ]);

      const islandAvail = availability.find(a => a._id === 'Island');
      expect(islandAvail?.count).toBe(1);
    });

    it('should return empty object for no available seats', async () => {
      // Create only occupied seats
      const seats = [
        {
          seatCode: 'isl-1-L-0',
          zoneType: 'Island',
          status: 'occupied',
          isActive: true,
          isDeleted: false,
        },
      ];

      await Seat.insertMany(seats);

      // Aggregate available seats
      const availability = await Seat.aggregate([
        { $match: { status: 'available', isDeleted: false, isActive: true } },
        { $group: { _id: '$zoneType', count: { $sum: 1 } } },
      ]);

      expect(availability).toHaveLength(0);
    });
  });

  describe('Seat Retrieval by Code', () => {
    it('should retrieve seat by code', async () => {
      // Create a seat
      const seat = new Seat({
        seatCode: 'isl-1-L-0',
        zoneType: 'Island',
        status: 'available',
        isActive: true,
        isDeleted: false,
      });

      await seat.save();

      // Retrieve by code
      const retrievedSeat = await Seat.findOne({
        seatCode: { $regex: /^isl-1-L-0$/i },
        isDeleted: false,
      });

      expect(retrievedSeat).toBeDefined();
      expect(retrievedSeat?.seatCode).toBe('isl-1-L-0');
    });

    it('should be case-insensitive when retrieving by code', async () => {
      // Create a seat
      const seat = new Seat({
        seatCode: 'isl-1-L-0',
        zoneType: 'Island',
        status: 'available',
        isActive: true,
        isDeleted: false,
      });

      await seat.save();

      // Retrieve with different case
      const retrievedSeat = await Seat.findOne({
        seatCode: { $regex: /^ISL-1-L-0$/i },
        isDeleted: false,
      });

      expect(retrievedSeat).toBeDefined();
      expect(retrievedSeat?.seatCode).toBe('isl-1-L-0');
    });

    it('should return null for non-existent seat code', async () => {
      // Create a seat
      const seat = new Seat({
        seatCode: 'isl-1-L-0',
        zoneType: 'Island',
        status: 'available',
        isActive: true,
        isDeleted: false,
      });

      await seat.save();

      // Try to retrieve non-existent seat
      const retrievedSeat = await Seat.findOne({
        seatCode: { $regex: /^nonexistent$/i },
        isDeleted: false,
      });

      expect(retrievedSeat).toBeNull();
    });
  });
});
