import { User } from './user.model.js'

export async function create(payload) {
  return User.create(payload)
}

export async function find() {}

export function findOne(filter) {
  return User.findOne(filter)
}

export async function update() {}

export async function deleteOne() {}

export async function deleteMany() {}
