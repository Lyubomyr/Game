class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :details_id
      t.integer :width
      t.integer :height
      t.integer :colors

      t.timestamps
    end
  end
end
