import torch
import torch.nn as nn

class NCFModel(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=32):
        super(NCFModel, self).__init__()
        # 유저와 아이템을 고차원 벡터로 변환 (ID의 크기만큼 임베딩 테이블 생성)
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.item_embedding = nn.Embedding(num_items, embedding_dim)
        
        # 다층 퍼셉트론(MLP) 계층
        self.fc1 = nn.Linear(embedding_dim * 2, 64)
        self.fc2 = nn.Linear(64, 32)
        self.output = nn.Linear(32, 1)
        
        self.relu = nn.ReLU()

    def forward(self, user_indices, item_indices):
        user_emb = self.user_embedding(user_indices)
        item_emb = self.item_embedding(item_indices)
        
        # 유저와 아이템 특성 결합
        x = torch.cat([user_emb, item_emb], dim=1)
        
        # 비선형 신경망 통과
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        
        return self.output(x)