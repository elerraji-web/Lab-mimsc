import { jest } from '@jest/globals';

describe('connectDB', () => {
  const originalEnv = process.env.MONGODB_URI;

  const setupModule = (connectImpl: () => Promise<any>) => {
    jest.resetModules();
    // Reset cached singleton used in connectDB
    // @ts-ignore
    delete global.mongoose;

    jest.doMock('mongoose', () => {
      return {
        __esModule: true,
        default: {
          connect: jest.fn(connectImpl),
        },
      };
    });

    return import('@/lib/mongodb');
  };

  afterEach(() => {
    process.env.MONGODB_URI = originalEnv;
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('uses MONGODB_URI env value when present', async () => {
    process.env.MONGODB_URI = 'mongodb://env-host:27017/env-db';
    const connectMock = jest.fn().mockResolvedValue({ connected: true });
    const { default: connectDB } = await setupModule(connectMock);

    await connectDB();

    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenCalledWith('mongodb://env-host:27017/env-db', { bufferCommands: false });
  });

  it('caches connection and does not reconnect on subsequent calls', async () => {
    const connectMock = jest.fn().mockResolvedValue({ connected: true });
    const { default: connectDB } = await setupModule(connectMock);

    await connectDB();
    await connectDB();

    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('resets cache after a failed connection attempt', async () => {
    const failOnce = jest.fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockResolvedValueOnce({ connected: true });

    const { default: connectDB } = await setupModule(failOnce);

    await expect(connectDB()).rejects.toThrow('first failure');
    await connectDB();

    expect(failOnce).toHaveBeenCalledTimes(2);
  });
});
