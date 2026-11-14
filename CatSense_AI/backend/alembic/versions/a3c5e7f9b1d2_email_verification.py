"""email verification and password reset codes

Revision ID: a3c5e7f9b1d2
Revises: 6f7763a01a74
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "a3c5e7f9b1d2"
down_revision = "6f7763a01a74"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # accounts that already exist count as verified; new accounts start unverified
    op.add_column("users", sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.text("true")))
    op.alter_column("users", "email_verified", server_default=sa.text("false"))

    op.create_table(
        "email_codes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("purpose", sa.String(length=10), nullable=False),
        sa.Column("code_hash", sa.String(length=255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_email_codes_user_purpose", "email_codes", ["user_id", "purpose"])


def downgrade() -> None:
    op.drop_index("ix_email_codes_user_purpose", table_name="email_codes")
    op.drop_table("email_codes")
    op.drop_column("users", "email_verified")