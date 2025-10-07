// Media 타입 정의

export interface Media {
  mediaId: string;
  storagePath: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  createdAt: string;
  ownerId: string;
  sightingId: string;
  sightingVisibility: 'public' | 'private';
}

export interface MediaBrowseResponse {
  content: Media[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface BrowseMediaParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface UpdateVisibilityRequest {
  visibility: 'public' | 'private';
}
