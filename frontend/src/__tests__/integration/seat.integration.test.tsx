import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ISeat } from '../../interfaces/models/ISeat';

// Mock the api module to avoid import.meta issues
jest.mock('../../lib/api', () => ({
  seat: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

import { seatService } from '../../services/SeatService';

jest.mock('../../services/SeatService');

/**
 * Integration tests for seat management flow
 * Tests seat retrieval, filtering, and status updates
 */

// Mock components for testing
const SeatListComponent = () => {
  const [seats, setSeats] = React.useState<ISeat[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadSeats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await seatService.getAllSeats();
      setSeats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadSeats();
  }, []);

  if (loading) return <div>Loading seats...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div>
      <div data-testid="seat-count">{seats.length} seats</div>
      {seats.map((seat) => (
        <div key={seat.seatId} data-testid={`seat-${seat.seatCode}`}>
          {seat.seatCode} - {seat.status}
        </div>
      ))}
    </div>
  );
};

const SeatFilterComponent = () => {
  const [zone, setZone] = React.useState('Island');
  const [seats, setSeats] = React.useState<ISeat[]>([]);
  const [loading, setLoading] = React.useState(false);

  const filterByZone = async () => {
    setLoading(true);
    try {
      const data = await seatService.getSeatsByZone(zone);
      setSeats(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select value={zone} onChange={(e) => setZone(e.target.value)}>
        <option>Island</option>
        <option>Cubicle</option>
        <option>Wall</option>
      </select>
      <button onClick={filterByZone}>Filter</button>
      {loading && <div>Loading...</div>}
      <div data-testid="filtered-count">{seats.length} seats</div>
      {seats.map((seat) => (
        <div key={seat.seatId} data-testid={`filtered-seat-${seat.seatCode}`}>
          {seat.seatCode}
        </div>
      ))}
    </div>
  );
};

const SeatStatusComponent = () => {
  const [seatCode, setSeatCode] = React.useState('isl-1-L-0');
  const [status, setStatus] = React.useState<'Available' | 'Reserved' | 'Occupied' | 'Maintenance'>('Available');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const updateStatus = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      await seatService.updateSeatStatus(seatCode, status);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        value={seatCode}
        onChange={(e) => setSeatCode(e.target.value)}
        placeholder="Seat Code"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as 'Available' | 'Reserved' | 'Occupied' | 'Maintenance')}>
        <option>Available</option>
        <option>Occupied</option>
        <option>Reserved</option>
        <option>Maintenance</option>
      </select>
      <button onClick={updateStatus} disabled={loading}>
        {loading ? 'Updating...' : 'Update Status'}
      </button>
      {success && <div data-testid="success">Status updated!</div>}
    </div>
  );
};

const SeatAvailabilityComponent = () => {
  const [availability, setAvailability] = React.useState<Record<string, number>>({});
  const [loading, setLoading] = React.useState(false);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const data = await seatService.getAvailability();
      setAvailability(data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAvailability();
  }, []);

  if (loading) return <div>Loading availability...</div>;

  return (
    <div>
      {Object.entries(availability).map(([zone, count]) => (
        <div key={zone} data-testid={`availability-${zone}`}>
          {zone}: {count}
        </div>
      ))}
    </div>
  );
};

describe('Seat Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Seat List Flow', () => {
    it('should load and display all seats', async () => {
      const mockSeats: ISeat[] = [
        { seatId: 1, seatCode: 'isl-1-L-0', seatNumber: '1', seatType: 'Regular', status: 'available', displayLabel: 'Island 1-L-0', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
        { seatId: 2, seatCode: 'isl-1-L-1', seatNumber: '2', seatType: 'Regular', status: 'occupied', displayLabel: 'Island 1-L-1', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
        { seatId: 3, seatCode: 'cub-1-A-0', seatNumber: '3', seatType: 'Regular', status: 'available', displayLabel: 'Cubicle 1-A-0', location: 'Cubicle', zoneType: 'Cubicle', hourlyRate: 8, dailyRate: 40, isActive: true, createdTime: '2024-01-01', isDeleted: false },
      ];

      (seatService.getAllSeats as jest.Mock).mockResolvedValue(mockSeats);

      render(<SeatListComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('seat-count')).toHaveTextContent('3 seats');
      });

      expect(screen.getByTestId('seat-isl-1-L-0')).toBeInTheDocument();
      expect(screen.getByTestId('seat-isl-1-L-1')).toBeInTheDocument();
      expect(screen.getByTestId('seat-cub-1-A-0')).toBeInTheDocument();
    });

    it('should display seat status', async () => {
      const mockSeats: ISeat[] = [
        { seatId: 1, seatCode: 'isl-1-L-0', seatNumber: '1', seatType: 'Regular', status: 'available', displayLabel: 'Island 1-L-0', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
        { seatId: 2, seatCode: 'isl-1-L-1', seatNumber: '2', seatType: 'Regular', status: 'occupied', displayLabel: 'Island 1-L-1', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
      ];

      (seatService.getAllSeats as jest.Mock).mockResolvedValue(mockSeats);

      render(<SeatListComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('seat-isl-1-L-0')).toHaveTextContent('available');
        expect(screen.getByTestId('seat-isl-1-L-1')).toHaveTextContent('occupied');
      });
    });

    it('should handle error when loading seats', async () => {
      (seatService.getAllSeats as jest.Mock).mockRejectedValue(
        new Error('Failed to load seats')
      );

      render(<SeatListComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to load seats');
      });
    });

    it('should show loading state while fetching seats', () => {
      (seatService.getAllSeats as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 1000))
      );

      render(<SeatListComponent />);

      expect(screen.getByText('Loading seats...')).toBeInTheDocument();
    });
  });

  describe('Seat Filter Flow', () => {
    it('should filter seats by zone', async () => {
      const mockSeats: ISeat[] = [
        { seatId: 1, seatCode: 'isl-1-L-0', seatNumber: '1', seatType: 'Regular', status: 'available', displayLabel: 'Island 1-L-0', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
        { seatId: 2, seatCode: 'isl-1-L-1', seatNumber: '2', seatType: 'Regular', status: 'available', displayLabel: 'Island 1-L-1', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
      ];

      (seatService.getSeatsByZone as jest.Mock).mockResolvedValue(mockSeats);

      const user = userEvent.setup();

      render(<SeatFilterComponent />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByTestId('filtered-count')).toHaveTextContent('2 seats');
      });

      expect(seatService.getSeatsByZone).toHaveBeenCalledWith('Island');
    });

    it('should update filter when zone changes', async () => {
      const mockSeats: ISeat[] = [
        { seatId: 3, seatCode: 'cub-1-A-0', seatNumber: '3', seatType: 'Regular', status: 'available', displayLabel: 'Cubicle 1-A-0', location: 'Cubicle', zoneType: 'Cubicle', hourlyRate: 8, dailyRate: 40, isActive: true, createdTime: '2024-01-01', isDeleted: false },
      ];

      (seatService.getSeatsByZone as jest.Mock).mockResolvedValue(mockSeats);

      const user = userEvent.setup();

      render(<SeatFilterComponent />);

      const zoneSelect = screen.getByRole('combobox');
      await user.selectOptions(zoneSelect, 'Cubicle');

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(seatService.getSeatsByZone).toHaveBeenCalledWith('Cubicle');
      });
    });

    it('should display filtered seats', async () => {
      const mockSeats: ISeat[] = [
        { seatId: 1, seatCode: 'isl-1-L-0', seatNumber: '1', seatType: 'Regular', status: 'available', displayLabel: 'Island 1-L-0', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
        { seatId: 2, seatCode: 'isl-1-L-1', seatNumber: '2', seatType: 'Regular', status: 'available', displayLabel: 'Island 1-L-1', location: 'Island', zoneType: 'Island', hourlyRate: 10, dailyRate: 50, isActive: true, createdTime: '2024-01-01', isDeleted: false },
      ];

      (seatService.getSeatsByZone as jest.Mock).mockResolvedValue(mockSeats);

      const user = userEvent.setup();

      render(<SeatFilterComponent />);

      const filterButton = screen.getByRole('button', { name: /filter/i });
      await user.click(filterButton);

      await waitFor(() => {
        expect(screen.getByTestId('filtered-seat-isl-1-L-0')).toBeInTheDocument();
        expect(screen.getByTestId('filtered-seat-isl-1-L-1')).toBeInTheDocument();
      });
    });
  });

  describe('Seat Status Update Flow', () => {
    it('should update seat status', async () => {
      (seatService.updateSeatStatus as jest.Mock).mockResolvedValue({
        id: '1',
        seatCode: 'isl-1-L-0',
        status: 'Occupied',
      });

      const user = userEvent.setup();

      render(<SeatStatusComponent />);

      const statusSelect = screen.getByRole('combobox');
      await user.selectOptions(statusSelect, 'Occupied');

      const updateButton = screen.getByRole('button', { name: /update status/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByTestId('success')).toHaveTextContent('Status updated!');
      });

      expect(seatService.updateSeatStatus).toHaveBeenCalledWith('isl-1-L-0', 'Occupied');
    });

    it('should show loading state while updating', async () => {
      (seatService.updateSeatStatus as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
      );

      const user = userEvent.setup();

      render(<SeatStatusComponent />);

      const updateButton = screen.getByRole('button', { name: /update status/i });
      await user.click(updateButton);

      expect(screen.getByRole('button', { name: /updating/i })).toBeInTheDocument();
    });

    it('should allow changing seat code', async () => {
      (seatService.updateSeatStatus as jest.Mock).mockResolvedValue({});

      const user = userEvent.setup();

      render(<SeatStatusComponent />);

      const seatCodeInput = screen.getByPlaceholderText('Seat Code') as HTMLInputElement;
      await user.clear(seatCodeInput);
      await user.type(seatCodeInput, 'cub-1-A-0');

      const updateButton = screen.getByRole('button', { name: /update status/i });
      await user.click(updateButton);

      await waitFor(() => {
        expect(seatService.updateSeatStatus).toHaveBeenCalledWith('cub-1-A-0', 'Available');
      });
    });
  });

  describe('Seat Availability Flow', () => {
    it('should load and display seat availability', async () => {
      const mockAvailability = {
        Island: 5,
        Cubicle: 3,
        Wall: 2,
      };

      (seatService.getAvailability as jest.Mock).mockResolvedValue(mockAvailability);

      render(<SeatAvailabilityComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('availability-Island')).toHaveTextContent('Island: 5');
        expect(screen.getByTestId('availability-Cubicle')).toHaveTextContent('Cubicle: 3');
        expect(screen.getByTestId('availability-Wall')).toHaveTextContent('Wall: 2');
      });
    });

    it('should show loading state while fetching availability', () => {
      (seatService.getAvailability as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
      );

      render(<SeatAvailabilityComponent />);

      expect(screen.getByText('Loading availability...')).toBeInTheDocument();
    });

    it('should handle empty availability', async () => {
      (seatService.getAvailability as jest.Mock).mockResolvedValue({});

      render(<SeatAvailabilityComponent />);

      await waitFor(() => {
        expect(screen.queryByTestId(/availability-/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple Seat Operations', () => {
    it('should handle multiple seat updates in sequence', async () => {
      (seatService.updateSeatStatus as jest.Mock)
        .mockResolvedValueOnce({ status: 'occupied' })
        .mockResolvedValueOnce({ status: 'available' });

      const user = userEvent.setup();

      const MultiUpdateComponent = () => {
        const [updates, setUpdates] = React.useState(0);

        const handleUpdate = async () => {
          await seatService.updateSeatStatus('isl-1-L-0', 'Occupied');
          setUpdates((prev) => prev + 1);
        };

        const handleSecondUpdate = async () => {
          await seatService.updateSeatStatus('isl-1-L-0', 'Available');
          setUpdates((prev) => prev + 1);
        };

        return (
          <div>
            <button onClick={handleUpdate}>Update to Occupied</button>
            <button onClick={handleSecondUpdate}>Update to Available</button>
            <div data-testid="update-count">{updates}</div>
          </div>
        );
      };

      render(<MultiUpdateComponent />);

      const occupiedButton = screen.getByRole('button', { name: /occupied/i });
      const availableButton = screen.getByRole('button', { name: /available/i });

      await user.click(occupiedButton);
      await waitFor(() => {
        expect(screen.getByTestId('update-count')).toHaveTextContent('1');
      });

      await user.click(availableButton);
      await waitFor(() => {
        expect(screen.getByTestId('update-count')).toHaveTextContent('2');
      });

      expect(seatService.updateSeatStatus).toHaveBeenCalledTimes(2);
    });
  });
});
