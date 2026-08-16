import { Request, Response, NextFunction } from 'express';
import { EventService } from './event.service';

export const listEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      category: req.query.category as string,
      date: req.query.date as string,
      search: req.query.search as string,
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 20,
    };

    const result = await EventService.listEvents(query);

    res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await EventService.getEventById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await EventService.createEvent(req.body);
    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await EventService.updateEvent(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const softDeleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await EventService.softDeleteEvent(req.params.id as string);
    res.status(200).json({
      success: true,
      data: { message: 'Event deleted successfully.' },
    });
  } catch (error) {
    next(error);
  }
};

export const registerForEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await EventService.registerForEvent(req.params.id as string);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
