export type Comment = {
  id: number;
  comment: string;
  created_at: Date;
  created_at_ts: number;
  parent_comment: number | null;
  user: {
    avatar: {
      url: string;
    };
    id: string;
    username: string;
  };
};
