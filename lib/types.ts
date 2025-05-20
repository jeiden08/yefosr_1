export type Admin = {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  published: boolean
  published_date: string | null
  author_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type ContactSubmission = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Event = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  location: string
  image_url: string
  start_date: string
  end_date: string | null
  published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Partner = {
  id: string
  name: string
  logo_url: string
  website_url: string | null
  description: string | null
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: string | null
  phone_number: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  last_login: string | null
  metadata: any
}

export type Program = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image_url: string
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Resource = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  file_url: string
  image_url: string | null
  resource_type: string
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type SiteSetting = {
  id: string
  key: string
  value: any
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Testimonial = {
  id: string
  name: string
  position: string | null
  organization: string | null
  content: string
  image_url: string | null
  order_index: number
  published: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}
