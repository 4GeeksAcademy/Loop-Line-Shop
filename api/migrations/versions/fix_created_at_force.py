"""force default NOW() on orders.created_at

Revision ID: fix_created_at_force
Revises: 3f4c14f7d7e1
Create Date: 2025-09-17 19:30:00

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "fix_created_at_force"
down_revision = "3f4c14f7d7e1"  # 👈 asegúrate que este coincide con tu última migración
branch_labels = None
depends_on = None


def upgrade():
    # Forzamos el default NOW() en Postgres
    op.execute("ALTER TABLE orders ALTER COLUMN created_at SET DEFAULT NOW();")


def downgrade():
    # Quitamos el default si hacemos rollback
    op.execute("ALTER TABLE orders ALTER COLUMN created_at DROP DEFAULT;")
