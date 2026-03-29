import torch
import torch.nn as nn

class NCFModel(nn.Module):
    def __init__(self, num_users, num_items, embed_size=32):
        super(NCFModel, self).__init__()
        # 유저와 아이템의 숨겨진 취향을 32차원 벡터로 변환
        self.user_embedding = nn.Embedding(num_users, embed_size)
        self.item_embedding = nn.Embedding(num_items, embed_size)
        
        # 딥러닝 신경망 레이어
        self.fc_layers = nn.Sequential(
            nn.Linear(embed_size * 2, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        )

    def forward(self, user_indices, item_indices):
        user_vector = self.user_embedding(user_indices)
        item_vector = self.item_embedding(item_indices)
        
        # 유저 벡터와 아이템 벡터를 이어 붙임(Concatenate)
        vector = torch.cat([user_vector, item_vector], dim=-1)
        
        # 신경망 통과하여 최종 예상 평점(Score) 출력
        prediction = self.fc_layers(vector)
        return prediction.squeeze()