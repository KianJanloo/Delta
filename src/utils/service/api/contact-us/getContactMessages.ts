import { fetchApi } from "@/core/interceptore/fetchApi";
import { ContactMessage } from "@/types/contact-us-type/contact-message";

export interface GetContactMessagesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  title?: string;
}

export type GetContactMessagesResponse =
  | ContactMessage[]
  | {
      totalCount?: number;
      data?: ContactMessage[];
      [key: string]: unknown;
    };

export const getContactMessages = async (
  params: GetContactMessagesParams = {},
): Promise<GetContactMessagesResponse> => {
  const {
    page = 1,
    limit = 10,
    sort,
    order,
    title,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  if (sort) queryParams.append("sort", sort);
  if (order) queryParams.append("order", order);
  if (title) queryParams.append("title", title);

  const response = await fetchApi.get(`/contact-us?${queryParams.toString()}`) as GetContactMessagesResponse;
  return response;
};
