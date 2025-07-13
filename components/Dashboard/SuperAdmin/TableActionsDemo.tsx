"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";

import { TableActions } from "@/components/common/TableActions";

export function TableActionsDemo() {
  const users = [
    {
      name: "John Doe",
      role: "Admin User",
      actions: {
        onDelete: {
          message:
            "Are you sure you want to delete this user? This action cannot be undone.",
          confirmLabel: "Delete User",
          onConfirm: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("User deleted successfully");
          },
        },
        onEdit: () => alert("Edit user"),
        onView: () => alert("View user details"),
      },
    },
    {
      name: "Jane Smith",
      role: "Staff User",
      actions: {
        onEdit: () => alert("Edit user"),
        onView: () => alert("View user details"),
      },
    },
    {
      name: "Bob Johnson",
      role: "Read-only User",
      actions: {
        onView: () => alert("View user details"),
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Table Actions Demo</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <p className="text-sm text-default-600">
            This demonstrates the reusable TableActions component with different
            action combinations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-default-600">{user.role}</p>
                </div>
                <TableActions {...user.actions} />
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
